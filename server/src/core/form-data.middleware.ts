import { NextFunction, Request, Response } from 'express'
import formidable from 'formidable'
import path from 'path'
import { MediaDirectories, UPLOAD_LOCAL_DIR } from './local-file.service'
import { UploadException } from './media.exception'

const MB = 1024 * 1024
const MAX_SIZE = 30
const MAX_FILES = 10

interface FormDataParserOptions extends formidable.Options {}

const defaultOptions: FormDataParserOptions = {
  uploadDir: path.resolve(UPLOAD_LOCAL_DIR, MediaDirectories.file),
  keepExtensions: true,
  maxFileSize: MAX_SIZE * MB,
  maxTotalFileSize: 100 * MB,
  maxFiles: MAX_FILES,
  filter(part) {
    const { mimetype, name } = part
    if (name === 'images') return Boolean(mimetype?.startsWith('image/'))
    if (name === 'videos') return Boolean(mimetype?.startsWith('video/'))
    if (name === 'audios') return Boolean(mimetype?.startsWith('audio/'))
    if (name === 'files') return true
    return false
  },
}

/**
 * Middleware để parse multipart/form-data.
 * Gán các trường vào `req.body` và các file vào `req.files`.
 * @param options - Tùy chọn cho formidable.
 * @default maxFileSize: 25MB, maxTotalFileSize: 100MB, maxFiles: 10
 * @default filter Đã định nghĩa sẵn để chỉ chấp nhận images, videos, audios. tương ứng với tên trường.
 */
export const formDataParser = (options?: FormDataParserOptions) => {
  const { maxFileSize, maxTotalFileSize, maxFiles } = { ...defaultOptions, ...options }
  return async (req: Request, res: Response, next: NextFunction) => {
    const form = formidable({ ...defaultOptions, ...options })
    try {
      const [fields, files] = await form.parse(req)
      req.body = fields
      req.files = files
      next()
    } catch (error: any) {
      if (error?.httpCode == 413)
        throw new UploadException(error, {
          maxFiles,
          maxFileSizeInMB: maxFileSize ? maxFileSize / MB : undefined,
          maxTotalFileSizeInMB: maxTotalFileSize ? maxTotalFileSize / MB : undefined,
        })
      next(error)
    }
  }
}

/**
 * Middleware để parse multipart/form-data với 1 file video.
 */
export const singleVideoMiddleware = formDataParser({
  maxFileSize: 500 * 1024 * 1024, // 500MB
  maxTotalFileSize: 500 * 1024 * 1024, // 500MB
  maxFiles: 1,
  multiples: false,
  filter: (p) => {
    return Boolean(p.name === 'video' && p.mimetype?.startsWith('video/'))
  },
})
