import { envConfig } from '@/config/env-config'
import { GetObjectCommand, ListBucketsCommand, S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { Response } from 'express'
import { readFileSync } from 'fs'
import { logger } from './logger.service'

class S3Service {
  // Singleton
  private static intance: S3Service
  private constructor() {}
  static getInstance() {
    if (!S3Service.intance) {
      S3Service.intance = new S3Service()
    }
    return S3Service.intance
  }

  private uploadClient: S3Client = new S3Client({
    region: envConfig.upload.awsRegion,
    credentials: {
      accessKeyId: envConfig.upload.awsAccessKeyId,
      secretAccessKey: envConfig.upload.awsSecretAccessKey,
    },
  })
  verifyS3Connection = async () => {
    const command = new ListBucketsCommand({})
    try {
      await this.uploadClient.send(command)
      logger.success('Đã kết nối đến S3 thành công')
      return true
    } catch (error) {
      logger.warn('Kết nối đến S3 thất bại. sẽ không thể sử dụng chức năng upload file.')
      return false
    }
  }

  /**
   *
   * @param filename Tên file khi lưu trên S3
   * @param filepath Đường dẫn file trên server
   * @param ContenType kiểu nội dung file, nếu không truyền sẽ tự động tải khi vào link file
   * @returns
   */
  upload = async (filename: string, filepath: string, contentType?: string) => {
    const file = readFileSync(filepath)
    const upload = new Upload({
      client: this.uploadClient,
      params: {
        Bucket: envConfig.upload.s3BucketName,
        Key: filename,
        Body: file,
        ContentType: contentType,
      },
      queueSize: 4,
      partSize: 5 * 1024 * 1024, // 5MB
      leavePartsOnError: false, // Xoá các phần đã tải lên nếu có lỗi xảy ra
    })
    upload.on('httpUploadProgress', (progress) => {})
    return upload.done()
  }

  sendFileFromS3 = async (res: Response, filepath: string) => {
    const command = new GetObjectCommand({
      Bucket: envConfig.upload.s3BucketName,
      Key: filepath,
    })
    const data = await this.uploadClient.send(command)
    if (data.ContentType) res.set('Content-Type', data.ContentType)
    if (data.ContentLength) res.set('Content-Length', data.ContentLength.toString())
    if (data.ETag) res.set('ETag', data.ETag)
    ;(data.Body as any).pipe(res)
  }

  getFileFromS3 = async (filepath: string) => {
    const command = new GetObjectCommand({
      Bucket: envConfig.upload.s3BucketName,
      Key: filepath,
    })
    return this.uploadClient.send(command)
  }

  getFileSizeFromS3 = async (filepath: string) => {
    const headCommand = new GetObjectCommand({
      Bucket: envConfig.upload.s3BucketName,
      Key: filepath,
      Range: 'bytes=0-1', // chỉ để lấy metadata
    })
    const headData = await this.uploadClient.send(headCommand)
    return Number(headData.ContentRange?.split('/')[1] || headData.ContentLength)
  }

  readS3FileSegment = async (filepath: string, start: number, end: number) => {
    const command = new GetObjectCommand({
      Bucket: envConfig.upload.s3BucketName,
      Key: filepath,
      Range: `bytes=${start}-${end}`,
    })
    return this.uploadClient.send(command)
  }
}

export const s3Service = S3Service.getInstance()
