import { envConfig } from '@/config/env-config'
import { BadRequestException, NotFoundException } from '@/core/exceptions'
import { MediaDirectories, UPLOAD_LOCAL_DIR, localFileService } from '@/core/local-file.service'
import { HttpStatusCode } from '@/core/status-code'
import { s3Service } from '@/lib/s3.service'
import { SOCKET_EVENTS } from '@/socket/event.const'
import { Request, RequestHandler, Response } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import mime from 'mime'
import path from 'path'
import { IChatIdParamDto } from '../chat/chat.req.dto'
import { ChatResDto, IChatResDto } from '../chat/chat.res.dto'
import { IMessageResDto, MessageResDto } from '../message/message.res.dto'
import { messageService } from '../message/message.service'
import { UserResDto } from '../user/user.res.dto'
import { IMedia } from './media.db'
import { mediaQueue } from './media.queue'

import { IGetFileReqParamsDto, IMediaIdParamDto, IUpdateMediaDto } from './media.req'
import { IMediaResDto } from './media.res'
import { Media, MediaType } from './media.schema'
import { mediaService } from './media.service'

const IS_LOCAL = envConfig.upload.provider === 'local'

class MediaCtrl {
  private sendMessageSocket = (
    req: Request,
    res: Response,
    payload: { message: IMessageResDto; chat: IChatResDto },
  ) => {
    const io = req.io
    const { chat, message } = payload
    const messageRes = MessageResDto.parse(message)
    const chatRes = ChatResDto.parse(chat)
    const resultPayload = { message: messageRes, chat: chatRes }
    io.to(chat.id).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, resultPayload)
    res.status(HttpStatusCode.Created).json(resultPayload)
  }
  // Lấy thông tin media theo id
  getOneById: RequestHandler<IMediaIdParamDto, IMedia> = async (req, res) => {
    const media = await mediaService.findOneById(req.params.mediaId)
    if (!media) throw new NotFoundException('Không tìm thấy media')
    res.json(Media.parse(media))
  }

  updateMedia: RequestHandler<any, IMediaResDto, IUpdateMediaDto> = async (req, res) => {
    const mediaId = req.params.mediaId
    const updateData = req.body
    const updatedMedia = await mediaService.update(mediaId, updateData)
    if (!updatedMedia) throw new NotFoundException('Không tìm thấy media để cập nhật')
    res.json(Media.parse(updatedMedia))
  }

  muiltiUploadMedia: RequestHandler<IChatIdParamDto> = async (req, res) => {
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
    const medias = await mediaService.handleTransformFile(allFiles, IS_LOCAL)
    const response = await messageService.create({
      chatId,
      senderId: user.userId,
      content,
      mediaIds: medias.map((media) => media.id),
    })
    return this.sendMessageSocket(req, res, response)
  }

  uploadAvatar: RequestHandler = async (req, res) => {
    const images = req.files?.image
    if (!images || (Array.isArray(images) && images.length === 0))
      throw new BadRequestException(undefined, 'Chưa có ảnh để upload, hoặc các ảnh không hợp lệ')
    const result = await mediaService.handleTransformAvatar(images[0], IS_LOCAL, req.user.userId)
    res.status(HttpStatusCode.Created).json(UserResDto.parse(result))
  }
  // Upload video chuyển sang HLS
  uploadVideoHls: RequestHandler = async (req, res) => {
    const videos = req.files?.video
    if (!videos || (Array.isArray(videos) && videos.length === 0))
      throw new BadRequestException(
        undefined,
        'Chưa có video để upload, hoặc các video không hợp lệ',
      )
    const result = await mediaService.handleVideoToHLS(videos[0])
    mediaQueue.enqueue({ id: result.id, video: videos[0], chatId: req.params.chatId })
    res.status(HttpStatusCode.Created).json(Media.parse(result))
  }

  // Upload video chuyển sang HLS
  createMessageWithVideoHLS: RequestHandler<IChatIdParamDto> = async (req, res) => {
    const videos = req.files?.video
    if (!videos || (Array.isArray(videos) && videos.length === 0))
      throw new BadRequestException(
        undefined,
        'Chưa có video để upload, hoặc các video không hợp lệ',
      )
    const chatId = req.params.chatId
    const senderId = req.user.userId
    const contents = req.body.contents
    const content = contents && contents.length > 0 ? contents[0] : ''
    const media = await mediaService.handleVideoToHLS(videos[0])
    const response = await messageService.create({
      chatId,
      senderId,
      content,
      mediaIds: [media.id],
    })
    mediaQueue.enqueue({ id: media.id, video: videos[0], chatId })
    return this.sendMessageSocket(req, res, response)
  }

  // Phục vụ file đã upload, chỉ tải do không truyền content-type khi upload lên s3
  serveFile: RequestHandler<IGetFileReqParamsDto> = async (req, res, next) => {
    const { mediaType, fileName } = req.params
    const localFilePath = localFileService.getFilePath(mediaType, fileName)
    const s3FilePath = MediaDirectories[mediaType] + fileName
    try {
      if (IS_LOCAL)
        return res.sendFile(localFilePath, (err) => {
          if (err) next(new NotFoundException('Không tìm thấy file'))
        })
      return await s3Service.sendFileFromS3(res, s3FilePath)
    } catch (error) {
      next(new NotFoundException('Không tìm thấy file'))
    }
  }

  serveVideoStream: RequestHandler = async (req, res) => {
    const MAX_CHUNK_SIZE = 10 ** 6
    const videoName = req.params.videoName
    const range = req.headers.range
    const contentType = mime.getType(videoName) ?? 'video/mp4'
    const videoPath = path.resolve(UPLOAD_LOCAL_DIR, MediaDirectories.video, videoName)
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
    const m3u8Path = localFileService.getFilePath(MediaType.video_hls, id, 'master.m3u8')
    return res.sendFile(m3u8Path, (err) => {
      if (err) next(new NotFoundException('Không tìm thấy file m3u8'))
    })
  }

  // Phục vụ playlist HLS
  serveVideoHlsPlaylist: RequestHandler = (req, res, next) => {
    const { id, v, segment } = req.params
    if (!IS_LOCAL)
      return s3Service.sendFileFromS3(res, `${MediaDirectories.video_hls}${id}/${v}/${segment}`)
    const playlistPath = localFileService.getFilePath(MediaType.video_hls, id, v, segment)
    return res.sendFile(playlistPath, (err) => {
      if (err) next(new NotFoundException('Không tìm thấy playlist HLS'))
    })
  }
}

export const mediaCtrl = new MediaCtrl()
