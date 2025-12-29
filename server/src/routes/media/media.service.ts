import { envConfig } from '@/config/env-config'
import { NotFoundException } from '@/core/exceptions'
import { localFileService, MediaDirectories, UPLOAD_LOCAL_DIR } from '@/core/local-file.service'
import { BaseService } from '@/lib/database/base-service'
import { s3Service } from '@/lib/s3.service'
import { ObjectId } from 'bson'
import { NextFunction, Response } from 'express'
import { File } from 'formidable'
import fs from 'fs'
import { rename, unlink } from 'fs/promises'
import mime from 'mime'
import path from 'path'
import sharp from 'sharp'
import { IChatResDto } from '../chat/chat.res.dto'
import { IMessageResDto } from '../message/message.res.dto'
import { messageService } from '../message/message.service'
import { userService } from '../user/user.service'
import { ffmpegService } from './ffmpeg.service'
import { ICreateMediaInput, IMedia, IUpdateMediaInput } from './media.db'
import { mediaQueue } from './media.queue'
import { MediaStatus, MediaType } from './media.schema'

const IS_LOCAL = envConfig.upload.provider === 'local'

class MediaService extends BaseService {
  async multiUploadAndCreateMessage(
    files: File[],
    chatId: string,
    userId: string,
    content: string,
  ): Promise<{ message: IMessageResDto; chat: IChatResDto }> {
    const medias = await this.handleTransformFile(files, IS_LOCAL)
    const response = await messageService.create({
      chatId,
      senderId: userId,
      content,
      mediaIds: medias.map((media) => media.id),
    })
    return response
  }

  async createMessageWithVideoHLS(
    video: File,
    chatId: string,
    senderId: string,
    content: string,
  ): Promise<{ message: IMessageResDto; chat: IChatResDto }> {
    const media = await this.handleVideoToHLS(video)
    const response = await messageService.create({
      chatId,
      senderId,
      content,
      mediaIds: [media.id],
    })
    mediaQueue.enqueue({ id: media.id, video: video, chatId })
    return response
  }

  async serveFile(mediaType: string, fileName: string, res: Response, next: NextFunction) {
    const localFilePath = localFileService.getFilePath(mediaType as MediaType, fileName)
    const s3FilePath = MediaDirectories[mediaType as MediaType] + fileName
    try {
      if (IS_LOCAL)
        return res.sendFile(localFilePath, (err: unknown) => {
          if (err) {
            // Khi client đóng kết nối (aborted) hoặc có lỗi xảy ra trong quá trình stream file,
            // headers có thể đã được gửi một phần. Nếu gọi next() lúc này sẽ gây lỗi ERR_HTTP_HEADERS_SENT.
            if (res.headersSent) return
            next(new NotFoundException('Không tìm thấy file'))
          }
        })
      return await s3Service.sendFileFromS3(res, s3FilePath)
    } catch (error) {
      next(new NotFoundException('Không tìm thấy file'))
    }
  }

  async getVideoStream(videoName: string, range: string) {
    const MAX_CHUNK_SIZE = 10 ** 6
    const contentType = mime.getType(videoName) ?? 'video/mp4'
    const videoPath = path.resolve(UPLOAD_LOCAL_DIR, MediaDirectories.video, videoName)

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

    let stream: any
    if (IS_LOCAL) {
      stream = fs.createReadStream(videoPath, { start, end })
    } else {
      const data = await s3Service.readS3FileSegment(MediaDirectories.video + videoName, start, end)
      stream = data.Body as any
    }
    return { headers, stream }
  }

  async serveVideoM3u8(id: string, res: Response, next: any) {
    if (!IS_LOCAL)
      return s3Service.sendFileFromS3(res, MediaDirectories.video_hls + id + '/master.m3u8')
    const m3u8Path = localFileService.getFilePath(MediaType.video_hls, id, 'master.m3u8')
    return res.sendFile(m3u8Path, (err: unknown) => {
      if (err) {
        // Kiểm tra headersSent để tránh lỗi crash server khi client ngắt kết nối giữa chừng
        if (res.headersSent) return
        next(new NotFoundException('Không tìm thấy file m3u8'))
      }
    })
  }

  async serveVideoHlsPlaylist(id: string, v: string, segment: string, res: Response, next: any) {
    if (!IS_LOCAL)
      return s3Service.sendFileFromS3(res, `${MediaDirectories.video_hls}${id}/${v}/${segment}`)
    const playlistPath = localFileService.getFilePath(MediaType.video_hls, id, v, segment)
    return res.sendFile(playlistPath, (err: unknown) => {
      if (err) {
        // Tránh lỗi ERR_HTTP_HEADERS_SENT nếu headers đã được gửi trước khi xảy ra lỗi
        if (res.headersSent) return
        next(new NotFoundException('Không tìm thấy playlist HLS'))
      }
    })
  }

  handleTransformFile = async (files: File[], isLocal: boolean): Promise<IMedia[]> => {
    const datas = await Promise.all(
      files.map(async (file) => {
        const contentType = mime.getType(file.filepath) || undefined
        let mediaType: MediaType = MediaType.file
        if (file.mimetype?.startsWith('image/')) mediaType = MediaType.image
        else if (file.mimetype?.startsWith('video/')) mediaType = MediaType.video
        else if (file.mimetype?.startsWith('audio/')) mediaType = MediaType.audio
        // Nếu là video hoặc audio thì cần di chuyển file từ thư mục temp của formidable sang thư mục upload tương ứng
        const isNeedMove = mediaType === MediaType.video || mediaType === MediaType.audio
        let url = localFileService.getUrlMedia(mediaType, file.newFilename)
        const filePath = localFileService.getFilePath(mediaType, file.newFilename)
        if (mediaType === MediaType.image) {
          const newFilePath = filePath.replace(path.extname(filePath), '.jpeg')
          url = localFileService.getUrlMedia(
            mediaType,
            file.newFilename.replace(path.extname(file.newFilename), '.jpeg'),
          )
          await sharp(file.filepath).jpeg().toFile(newFilePath)
          await unlink(file.filepath)
        }
        if (!isLocal) {
          let filePathToUpload = file.filepath
          let fileNameToUpload = file.newFilename

          if (mediaType === MediaType.image) {
            filePathToUpload = filePath.replace(path.extname(filePath), '.jpeg')
            fileNameToUpload = file.newFilename.replace(path.extname(file.newFilename), '.jpeg')
          }

          if (mediaType === MediaType.audio) {
            filePathToUpload = filePath.replace(path.extname(filePath), '.mp3')
            fileNameToUpload = file.newFilename.replace(path.extname(file.newFilename), '.mp3')
            await ffmpegService.convertAudio(file.filepath, filePathToUpload)
            // We don't unlink original here because formidable might delete it?
            // Actually formidable moves it to temp. We should clean up temp if we converted.
            await unlink(file.filepath)
          }

          await s3Service.upload(
            MediaDirectories[mediaType] + fileNameToUpload,
            filePathToUpload,
            contentType,
          )
          // If we created a new converted file, delete it after upload
          if (mediaType === MediaType.image || mediaType === MediaType.audio) {
            await unlink(filePathToUpload)
          } else {
            await unlink(file.filepath) // for other types (video raw, file)
          }
        } else if (isNeedMove) {
          if (mediaType === MediaType.audio) {
            const newFilePath = filePath.replace(path.extname(filePath), '.mp3')
            url = localFileService.getUrlMedia(
              mediaType,
              file.newFilename.replace(path.extname(file.newFilename), '.mp3'),
            )
            await ffmpegService.convertAudio(file.filepath, newFilePath)
            await unlink(file.filepath)
          } else {
            await rename(file.filepath, filePath)
          }
        }
        return {
          url,
          type: mediaType,
          originalName: file.originalFilename ?? file.newFilename,
        }
      }),
    )
    const results: IMedia[] = await this.createMany(
      datas.map((data) => ({
        ...data,
        status: MediaStatus.completed,
      })),
    )
    return results
  }

  handleTransformAvatar = async (image: File, isLocal: boolean, userId: string) => {
    const contentType = 'image/jpeg'
    const newFilename = image.newFilename.replace(path.extname(image.newFilename), '.jpeg')
    const url = localFileService.getUrlMedia(MediaType.image, newFilename)
    const filePath = localFileService.getFilePath(MediaType.image, newFilename)
    await sharp(image.filepath).resize(300, 300).jpeg().toFile(filePath)
    await unlink(image.filepath)
    if (!isLocal) {
      await s3Service.upload(MediaDirectories[MediaType.image] + newFilename, filePath, contentType)
      await unlink(filePath)
    }
    const [user] = await Promise.all([
      userService.update(userId, { avatarUrl: url }),
      this.create({
        url,
        type: MediaType.image,
        originalName: image.originalFilename ?? newFilename,
        status: MediaStatus.completed,
      }),
    ])
    return user
  }
  handleVideoToHLS = async (video: File): Promise<IMedia> => {
    const id = new ObjectId().toString()
    const url = localFileService.getUrlMedia(MediaType.video_hls, id, 'master.m3u8')
    return this.create({
      id,
      type: MediaType.video_hls,
      status: MediaStatus.pending,
      url,
      originalName: video.originalFilename ?? video.newFilename,
    })
  }
  async create(data: ICreateMediaInput): Promise<IMedia> {
    return this.prismaService.media.create({
      data: data,
    })
  }

  async createMany(data: ICreateMediaInput[]): Promise<IMedia[]> {
    await this.prismaService.media.createMany({
      data: data,
    })
    return this.prismaService.media.findMany({
      where: { url: { in: data.map((d) => d.url) } },
    })
  }

  async update(id: string, data: IUpdateMediaInput): Promise<IMedia> {
    return this.prismaService.media.update({
      where: { id: id },
      data: data,
    })
  }

  async findOneById(id: string): Promise<IMedia | null> {
    return this.prismaService.media.findUnique({
      where: { id: id },
    })
  }

  async findAll(): Promise<IMedia[]> {
    return this.prismaService.media.findMany({
      orderBy: { id: 'desc' },
    })
  }

  async delete(id: string): Promise<IMedia> {
    return this.prismaService.media.delete({
      where: { id: id },
    })
  }
}

export const mediaService = new MediaService()
