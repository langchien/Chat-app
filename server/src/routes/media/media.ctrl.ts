import { envConfig } from '@/config/env-config'
import { BadRequestException, NotFoundException } from '@/core/exceptions'
import { MediaDirectories, localFileService } from '@/core/local-file.service'
import { HttpStatusCode } from '@/core/status-code'
import { s3Service } from '@/lib/s3.service'
import { SOCKET_EVENTS } from '@/socket/event.const'
import { ObjectId } from 'bson'
import { RequestHandler } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import mime from 'mime'
import { IChatIdParamDto } from '../chat/chat.req.dto'
import { ChatResDto } from '../chat/chat.res.dto'
import { messageRepo } from '../message/message.repo'
import { MessageResDto } from '../message/message.res.dto'
import { IMedia } from './media.db'
import { mediaQueue } from './media.queue'
import { mediaRepo } from './media.repo'
import { IGetFileReqParamsDto, IMediaIdParamDto, IUpdateMediaDto } from './media.req'
import { IMediaResDto } from './media.res'
import { Media, MediaStatus, MediaType } from './media.schema'
import { mediaService } from './media.service'

const IS_LOCAL = envConfig.upload.provider === 'local'

class MediaCtrl {
  // Lấy thông tin media theo id
  getOneById: RequestHandler<IMediaIdParamDto, IMedia> = async (req, res) => {
    const media = await mediaRepo.findOneById(req.params.mediaId)
    if (!media) throw new NotFoundException('Không tìm thấy media')
    res.json(Media.parse(media))
  }

  updateMedia: RequestHandler<any, IMediaResDto, IUpdateMediaDto> = async (req, res) => {
    const mediaId = req.params.mediaId
    const updateData = req.body
    const updatedMedia = await mediaRepo.update(mediaId, updateData)
    if (!updatedMedia) throw new NotFoundException('Không tìm thấy media để cập nhật')
    res.json(Media.parse(updatedMedia))
  }

  muiltiUploadMedia: RequestHandler<IChatIdParamDto> = async (req, res) => {
    const io = req.io
    const user = req.user
    const chatId = req.params.chatId
    const contents: string[] | undefined = req.body?.contents
    const content = contents && contents.length > 0 ? contents[0] : ''
    if (!req.files)
      throw new BadRequestException(undefined, 'Chưa có file để upload, hoặc các file không hợp lệ')
    const allFiles = Object.values(req.files)
      .flat()
      .filter((file) => file instanceof File) // phải import File từ formidable
    if (allFiles.length === 0)
      throw new BadRequestException(undefined, 'Chưa có file để upload, hoặc các file không hợp lệ')
    const medias = await mediaService.handleTransformFile(allFiles)
    const { chat, message } = await messageRepo.create({
      chatId,
      senderId: user.userId,
      content,
      mediaIds: medias.map((media) => media.id),
    })
    const messageRes = MessageResDto.parse(message)
    const chatRes = ChatResDto.parse(chat)
    const resultPayload = { message: messageRes, chat: chatRes }
    io.to(chat.id).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, resultPayload)
    res.status(HttpStatusCode.Created).json(resultPayload)
  }

  // Upload video chuyển sang HLS
  uploadVideoHls: RequestHandler = async (req, res) => {
    const videos = req.files?.videos
    if (!videos || (Array.isArray(videos) && videos.length === 0))
      throw new BadRequestException(
        undefined,
        'Chưa có video để upload, hoặc các video không hợp lệ',
      )
    const video = videos[0]
    const id = new ObjectId().toString()
    const url = localFileService.getUrlMedia.video_hls(id, '/master.m3u8')
    const result = await mediaRepo.create({
      id,
      type: MediaType.video_hls,
      status: MediaStatus.pending,
      url,
      originalName: video.originalFilename ?? video.newFilename,
    })
    await mediaQueue.enqueue({ id, filename: video.newFilename })
    res.status(HttpStatusCode.Created).json(Media.parse(result))
  }

  // Phục vụ file đã upload, chỉ tải do không truyền content-type khi upload lên s3
  serveFile: RequestHandler<IGetFileReqParamsDto> = async (req, res, next) => {
    const { mediaDirectory, fileName } = req.params
    const filePath = mediaService.getFilePath(mediaDirectory, fileName)
    try {
      if (IS_LOCAL)
        return res.sendFile(filePath, (err) => {
          if (err) next(new NotFoundException('Không tìm thấy file'))
        })
      return await s3Service.sendFileFromS3(res, filePath)
    } catch (error) {
      next(new NotFoundException('Không tìm thấy file'))
    }
  }

  serveVideoStream: RequestHandler = async (req, res) => {
    const MAX_CHUNK_SIZE = 10 ** 6
    const videoName = req.params.videoName
    const range = req.headers.range
    const contentType = mime.getType(videoName) ?? 'video/mp4'
    const videoPath = localFileService.getFilePath.video(videoName)
    if (!range) throw new BadRequestException()
    let videoSize: number
    if (IS_LOCAL) {
      if (!fs.existsSync(videoPath)) throw new NotFoundException('Không tìm thấy video')
      videoSize = fs.statSync(videoPath).size
    } else videoSize = await s3Service.getFileSizeFromS3(MediaDirectories.video + videoName)
    const [startStr, endStr] = range.replace('bytes=', '').split('-')
    const start = Number(startStr)
    let end = endStr ? Number(endStr) : start + MAX_CHUNK_SIZE - 1
    end = Math.min(end, start + MAX_CHUNK_SIZE - 1, videoSize - 1)
    const contentLength = end - start + 1
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${videoSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': contentLength,
      'Content-Type': contentType,
    }
    res.writeHead(206, headers)
    if (IS_LOCAL) {
      const videoStream = fs.createReadStream(videoPath, { start, end })
      videoStream.pipe(res)
    } else {
      const data = await s3Service.readS3FileSegment(MediaDirectories.video + videoName, start, end)
      ;(data.Body as any).pipe(res)
    }
  }

  // Phục vụ file m3u8 HLS
  serveVideoM3u8: RequestHandler = (req, res, next) => {
    const id = req.params.id
    if (!IS_LOCAL)
      return s3Service.sendFileFromS3(res, MediaDirectories.video_hls + id + '/master.m3u8')
    const m3u8Path = localFileService.getFilePath.video_hls(id, 'master.m3u8')
    return res.sendFile(m3u8Path, (err) => {
      if (err) next(new NotFoundException('Không tìm thấy file m3u8'))
    })
  }

  // Phục vụ playlist HLS
  serveVideoHlsPlaylist: RequestHandler = (req, res, next) => {
    const { id, v, segment } = req.params
    if (!IS_LOCAL)
      return s3Service.sendFileFromS3(res, `${MediaDirectories.video_hls}${id}/${v}/${segment}`)
    const playlistPath = localFileService.getFilePath.video_hls(id, v, segment)
    return res.sendFile(playlistPath, (err) => {
      if (err) next(new NotFoundException('Không tìm thấy playlist HLS'))
    })
  }
}

export const mediaCtrl = new MediaCtrl()
