import { localFileService, MediaDirectories } from '@/core/local-file.service'
import { BaseService } from '@/lib/database/base-service'
import { s3Service } from '@/lib/s3.service'
import { ObjectId } from 'bson'
import { File } from 'formidable'
import { rename, unlink } from 'fs/promises'
import mime from 'mime'
import path from 'path'
import sharp from 'sharp'
import { userService } from '../user/user.service'
import { ICreateMediaInput, IMedia, IUpdateMediaInput } from './media.db'
import { MediaStatus, MediaType } from './media.schema'

class MediaService extends BaseService {
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
          await s3Service.upload(
            MediaDirectories[mediaType] + fileNameToUpload,
            filePathToUpload,
            contentType,
          )
          await unlink(filePathToUpload)
        } else if (isNeedMove) {
          await rename(file.filepath, filePath)
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
