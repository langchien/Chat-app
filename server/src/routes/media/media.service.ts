import { envConfig } from '@/config/env-config'
import { KeyDirectory, MediaDirectories, UPLOAD_LOCAL_DIR } from '@/core/local-file.service'
import { API_ROUTES } from '@/core/routes.const'
import { s3Service } from '@/lib/s3.service'
import { File } from 'formidable'
import { rename, unlink } from 'fs/promises'
import mime from 'mime'
import path from 'path'
import sharp from 'sharp'
import { IMedia } from './media.db'
import { mediaRepo } from './media.repo'
import { MediaStatus, MediaType } from './media.schema'

const IS_LOCAL = envConfig.upload.provider === 'local'
const MEDIA_BASE_URL = envConfig.serverUri + API_ROUTES.MEDIA + '/'

class MediaService {
  handleTransformFile = async (files: File[], messageId?: string): Promise<IMedia[]> => {
    const datas = await Promise.all(
      files.map(async (file) => {
        const contentType = mime.getType(file.filepath) || undefined
        let keyDirectory: KeyDirectory = 'file'
        if (file.mimetype?.startsWith('image/')) keyDirectory = 'image'
        else if (file.mimetype?.startsWith('video/')) keyDirectory = 'video'
        const url = MEDIA_BASE_URL + MediaDirectories[keyDirectory] + file.newFilename
        const filePath = path.resolve(
          UPLOAD_LOCAL_DIR,
          MediaDirectories[keyDirectory],
          file.newFilename,
        )
        if (keyDirectory === 'image') {
          const newFilePath = filePath.replace(path.extname(filePath), '.jpeg')
          await sharp(file.filepath).jpeg().toFile(newFilePath)
          await unlink(file.filepath)
        }
        if (!IS_LOCAL) {
          const _filePath = keyDirectory === 'video' ? file.filepath : filePath
          await s3Service.upload(
            MediaDirectories[keyDirectory] + file.newFilename,
            _filePath,
            contentType,
          )
          await unlink(_filePath)
        } else if (keyDirectory === 'video') {
          await rename(file.filepath, filePath)
        }
        return {
          url,
          type: MediaType[keyDirectory],
          originalName: file.originalFilename ?? file.newFilename,
        }
      }),
    )
    const results: IMedia[] = await mediaRepo.createMany(
      datas.map((data) => ({
        ...data,
        status: MediaStatus.compileted,
        messageId,
      })),
    )
    return results
  }

  getFilePath = (mediaDirectory: 'videos' | 'images' | 'files', fileName: string) => {
    const localFilePath = path.resolve(UPLOAD_LOCAL_DIR, mediaDirectory, fileName)
    const s3FileKey = mediaDirectory + '/' + fileName
    if (IS_LOCAL) return localFilePath
    return s3FileKey
  }

  handleUnlinkFiles = async (files: File[]) => {
    await Promise.all(
      files.map(async (file) => {
        await unlink(file.filepath)
      }),
    )
  }
}

export const mediaService = new MediaService()
