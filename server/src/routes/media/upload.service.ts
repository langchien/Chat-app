import { PayloadTooLargeException } from '@/core/exceptions'

import { Request } from 'express'
import formidable, { File } from 'formidable'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fs } from 'zx'
import { MediaDirectories, UPLOAD_LOCAL_DIR } from './dir.const'

class UploadService {
  async handleFileUpload(req: Request, maxSizeInMB = 25) {
    return new Promise<File>((resolve, reject) => {
      const form = formidable({
        uploadDir: path.resolve(UPLOAD_LOCAL_DIR, MediaDirectories.Files),
        maxFiles: 1,
        maxFileSize: maxSizeInMB * 1024 * 1024, // maxSizeInMB MB
        keepExtensions: true,
      })
      form.parse(req, (err, fields, files) => {
        if (err) return reject(new PayloadTooLargeException())
        if (!Boolean(files.file)) return reject(new PayloadTooLargeException('File là bắt buộc'))
        resolve((files.file as File[])[0])
      })
    })
  }

  async handleUploadImages(req: Request) {
    // chuyển callback thành promise để có thể dùng async await, handle error default được
    return new Promise<File[]>((resolve, reject) => {
      const form = formidable({
        uploadDir: path.resolve(UPLOAD_LOCAL_DIR, MediaDirectories.Temp),
        maxFiles: 5,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        maxTotalFileSize: 50 * 1024 * 1024, // 50MB
        keepExtensions: true,
        filter: (part) => {
          const { mimetype, name } = part
          const isValidImage = name === 'images' && Boolean(mimetype?.startsWith('image/'))
          return isValidImage
        },
      })
      form.parse(req, (err, fields, files) => {
        if (err) return reject(new PayloadTooLargeException())
        if (!Boolean(files.images))
          return reject(new PayloadTooLargeException('Images là bắt buộc'))
        resolve(files.images as File[])
      })
    })
  }

  handleVideoUpload(req: Request, maxSizeInMB = 25, isHls = false) {
    return new Promise<File>((resolve, reject) => {
      const form = formidable({
        uploadDir: path.resolve(
          UPLOAD_LOCAL_DIR,
          isHls ? MediaDirectories.VideoHLS : MediaDirectories.Videos,
        ),
        maxFiles: 1,
        maxFileSize: maxSizeInMB * 1024 * 1024, // maxSizeInMB MB
        keepExtensions: true,
        filter: (part) => {
          const { mimetype, name } = part
          const isValidImage = name === 'video' && Boolean(mimetype?.startsWith('video/'))
          return isValidImage
        },
      })
      form.parse(req, (err, fields, files) => {
        if (err) return reject(new PayloadTooLargeException())
        if (!Boolean(files.video)) return reject(new PayloadTooLargeException('Video là bắt buộc'))
        resolve((files.video as File[])[0])
      })
    })
  }

  async initFolder() {
    if (!existsSync(UPLOAD_LOCAL_DIR)) await mkdir(path.resolve(UPLOAD_LOCAL_DIR))
    const uploadFolders = Object.values(MediaDirectories).map((dir) =>
      path.resolve(UPLOAD_LOCAL_DIR, dir),
    )
    await Promise.all(
      uploadFolders.map(async (folder) => {
        if (!existsSync(folder)) return mkdir(path.resolve(UPLOAD_LOCAL_DIR, folder))
      }),
    )
  }

  // đệ quy lấy tất cả các file trong thư mục và các thư mục con
  async getFiles(dir: string, files: string[] = []) {
    const fileList = fs.readdirSync(dir)
    for (const fileName of fileList) {
      const filePath = `${dir}/${fileName}`
      if (fs.statSync(filePath).isDirectory()) this.getFiles(filePath, files)
      else files.push(filePath)
    }
    return files
  }
}
export const uploadService = new UploadService()
