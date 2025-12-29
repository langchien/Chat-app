import { envConfig } from '@/config/env-config'
import { MediaDirectories, localFileService } from '@/core/local-file.service'
import { logger } from '@/lib/logger.service'
import { s3Service } from '@/lib/s3.service'
import { ffmpegService } from '@/routes/media/ffmpeg.service'
import { socketService } from '@/socket'
import { File } from 'formidable'
import fs from 'fs'
import { unlink } from 'fs/promises'
import mime from 'mime'
import { MediaStatus, MediaType } from './media.schema'
import { mediaService } from './media.service'

class MediaQueue {
  items: {
    id: string
    chatId: string
    video: File
  }[] = []
  encoding: boolean = false

  enqueue(item: { id: string; chatId: string; video: File }) {
    this.items.push(item)
    this.processQueue()
  }

  async processQueue() {
    if (this.encoding) return
    const item = this.items.shift()
    if (!item) return
    this.encoding = true
    try {
      const r = await mediaService.update(item.id, {
        status: MediaStatus.processing,
      })
      logger.info(`Bắt đầu mã hóa HLS cho video: ${r?.url}`)
      const folderPath = localFileService.getFilePath(MediaType.video_hls, item.id)
      const fileOriginPath = item.video.filepath
      const fileName = item.video.originalFilename ?? item.video.newFilename
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
      await ffmpegService.encodeHLSWithMultipleVideoStreams(fileOriginPath, folderPath)
      logger.info(`Đã mã hóa HLS cho video: ${fileName}`)
      const isLocal = envConfig.upload.provider === 'local'
      if (!isLocal) {
        const files = await localFileService.getFiles(folderPath)
        await Promise.all(
          files.map((filePath) => {
            const relativePath = item.id + filePath.replace(folderPath, '').replace(/\\/g, '/')
            const fileName = MediaDirectories.video_hls + relativePath
            return s3Service.upload(fileName, filePath, mime.getType(filePath) as string)
          }),
        )
        // xóa file và folder chứa video đã mã hóa sau khi upload lên s3
        await Promise.all([unlink(fileOriginPath), fs.rmdirSync(folderPath, { recursive: true })])
      } else await unlink(fileOriginPath)
      const uploadResult = await mediaService.update(item.id, {
        status: MediaStatus.completed,
      })
      socketService.mediaProcessingUpdate(item.chatId, uploadResult)
    } catch (error) {
      logger.error('Lỗi trong quá trình xử lý mục hàng đợi:', error)
      const failedResult = await mediaService.update(item.id, {
        status: MediaStatus.failed,
      })
      socketService.mediaProcessingUpdate(item.chatId, failedResult)
    } finally {
      this.encoding = false
      this.processQueue()
    }
  }
}

export const mediaQueue = new MediaQueue()
