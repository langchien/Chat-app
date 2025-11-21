import { envConfig } from '@/config/env-config'
import { logger } from '@/lib/logger.service'
import { s3Service } from '@/lib/s3.service'
import { getFilePath, MediaDirectories } from '@/routes/media/dir.const'
import { ffmpegService } from '@/routes/media/ffmpeg.service'
import fs from 'fs'
import { unlink } from 'fs/promises'
import mime from 'mime'
import { mediaRepo } from './media.repo'
import { MediaStatus } from './media.schema'
import { uploadService } from './upload.service'

class MediaQueue {
  items: {
    id: string
    filename: string
  }[] = []
  encoding: boolean = false

  async enqueue(item: { id: string; filename: string }) {
    this.items.push(item)
    this.processQueue()
  }

  async processQueue() {
    if (this.encoding) return
    const item = this.items.shift()
    if (!item) return
    this.encoding = true
    try {
      const r = await mediaRepo.update(item.id, {
        status: MediaStatus.Processing,
      })
      logger.info(`Bắt đầu mã hóa HLS cho video: ${r?.url}`)
      const folderPath = getFilePath.VideoHLS(item.id)
      const fileOriginPath = getFilePath.VideoHLS(item.filename)
      if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath)
      await ffmpegService.encodeHLSWithMultipleVideoStreams(fileOriginPath, item.id)
      logger.info(`Đã mã hóa HLS cho video: ${item.filename}`)
      const isLocal = envConfig.upload.provider === 'local'
      if (!isLocal) {
        const files = await uploadService.getFiles(folderPath)
        await Promise.all(
          files.map((filePath) => {
            const relativePath = item.id + filePath.replace(folderPath, '').replace(/\\/g, '/')
            const fileName = MediaDirectories.VideoHLS + relativePath
            return s3Service.upload(fileName, filePath, mime.getType(filePath) as string)
          }),
        )
        // xóa file và folder chứa video đã mã hóa sau khi upload lên s3
        await Promise.all([unlink(fileOriginPath), fs.rmdirSync(folderPath, { recursive: true })])
      } else await unlink(fileOriginPath)
      await mediaRepo.update(item.id, {
        status: MediaStatus.Compileted,
      })
    } catch (error) {
      logger.error('Lỗi trong quá trình xử lý mục hàng đợi:', error)
      await mediaRepo
        .update(item.id, {
          status: MediaStatus.Failed,
        })
        .catch((err) => {
          logger.error('Lỗi khi cập nhật trạng thái thất bại cho mục hàng đợi:', err)
        })
    } finally {
      this.encoding = false
      this.processQueue()
    }
  }
}

export const mediaQueue = new MediaQueue()
