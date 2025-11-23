import { envConfig } from '@/config/env-config'
import { BadRequestException, NotFoundException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { s3Service } from '@/lib/s3.service'
import { RequestHandler } from 'express'
import fs from 'fs'
import { unlink } from 'fs/promises'
import mime from 'mime'
import { ObjectId } from 'mongodb'
import path from 'path'
import sharp from 'sharp'
import { getFilePath, getUrlMedia, MediaDirectories } from './dir.const'
import { IMedia } from './media.db'
import { mediaQueue } from './media.queue'
import { mediaRepo } from './media.repo'
import { IMediaIdParamDto } from './media.req'
import { Media, MediaStatus, MediaType } from './media.schema'
import { uploadService } from './upload.service'

const IS_LOCAL = envConfig.upload.provider === 'local'

class MediaCtrl {
  // Lấy thông tin media theo id
  getOneById: RequestHandler<IMediaIdParamDto, IMedia> = async (req, res) => {
    const media = await mediaRepo.findOneById(req.params.mediaId)
    if (!media) throw new NotFoundException('Không tìm thấy media')
    res.json(Media.parse(media))
  }

  // Upload file thường
  uploadFile: RequestHandler = async (req, res) => {
    const file = await uploadService.handleFileUpload(req)
    const url = getUrlMedia.Files(file.newFilename)
    const filePath = getFilePath.Files(file.newFilename)
    if (!IS_LOCAL) {
      await s3Service.upload(MediaDirectories.Files + file.newFilename, filePath)
      await unlink(filePath)
    }
    const result = await mediaRepo.create({
      type: MediaType.File,
      status: MediaStatus.Compileted,
      url,
    })
    res.status(HttpStatusCode.Created).json(Media.parse(result))
  }

  // Upload nhiều ảnh, chuyển sang jpg
  uploadImages: RequestHandler = async (req, res) => {
    const CONTENT_TYPE = 'image/jpg'
    const files = await uploadService.handleUploadImages(req)
    const results = await Promise.all(
      files.map(async (file) => {
        const filename = path.parse(file.newFilename).name + '.jpg'
        const filepath = file.filepath
        const newFilePath = getFilePath.Images(filename)
        const url = getUrlMedia.Images(filename)
        await sharp(filepath).jpeg().toFile(newFilePath)
        if (!IS_LOCAL) {
          await s3Service.upload(MediaDirectories.Images + filename, newFilePath, CONTENT_TYPE)
          await Promise.all([unlink(newFilePath), unlink(filepath)])
        } else await unlink(filepath)
        return url
      }),
    )
    const resultsData = await mediaRepo.createMany(
      results.map((url) => ({
        type: MediaType.Image,
        status: MediaStatus.Compileted,
        url,
      })),
    )
    res.status(HttpStatusCode.Created).json(resultsData.map((item) => Media.parse(item)))
  }

  // Upload video thường
  uploadVideo: RequestHandler = async (req, res) => {
    const video = await uploadService.handleVideoUpload(req)
    const url = getUrlMedia.Videos(video.newFilename)
    const filepath = video.filepath
    if (!IS_LOCAL) {
      await s3Service.upload(
        MediaDirectories.Videos + video.newFilename,
        filepath,
        mime.getType(video.filepath) ?? 'video/mp4',
      )
      await unlink(filepath)
    }
    const result = await mediaRepo.create({
      type: MediaType.Video,
      status: MediaStatus.Compileted,
      url,
    })
    res.status(HttpStatusCode.Created).json(Media.parse(result))
  }

  // Upload video chuyển sang HLS
  uploadVideoHls: RequestHandler = async (req, res) => {
    const video = await uploadService.handleVideoUpload(req, 100, true)
    const id = new ObjectId().toString()
    const url = getUrlMedia.VideoHLS(id, '/master.m3u8')
    const result = await mediaRepo.create({
      _id: new ObjectId(id),
      type: MediaType.HLS,
      status: MediaStatus.Pending,
      url,
    })
    await mediaQueue.enqueue({ id, filename: video.newFilename })
    res.status(HttpStatusCode.Created).json(Media.parse(result))
  }

  // Phục vụ file đã upload, chỉ tải do không truyền content-type khi upload lên s3
  serveFile: RequestHandler = async (req, res, next) => {
    try {
      const fileName = req.params.fileName
      const filePath = getFilePath.Files(fileName)
      if (IS_LOCAL)
        return res.sendFile(filePath, (err) => {
          if (err) next(new NotFoundException('Không tìm thấy file'))
        })
      return await s3Service.sendFileFromS3(res, MediaDirectories.Files + fileName)
    } catch (error) {
      next(new NotFoundException('Không tìm thấy file'))
    }
  }

  // Phục vụ ảnh đã upload
  serveImage: RequestHandler = async (req, res, next) => {
    try {
      const imageName = req.params.imageName
      const imagePath = getFilePath.Images(imageName)
      if (IS_LOCAL)
        return res.sendFile(imagePath, (err) => {
          if (err) next(new NotFoundException('Không tìm thấy ảnh'))
        })
      return await s3Service.sendFileFromS3(res, MediaDirectories.Images + imageName)
    } catch (error) {
      next(new NotFoundException('Không tìm thấy ảnh'))
    }
  }

  serveVideoStream: RequestHandler = async (req, res) => {
    const MAX_CHUNK_SIZE = 10 ** 6
    const videoName = req.params.videoName
    const range = req.headers.range
    const contentType = mime.getType(videoName) ?? 'video/mp4'
    const videoPath = getFilePath.Videos(videoName)
    if (!range) throw new BadRequestException()
    let videoSize: number
    if (IS_LOCAL) {
      if (!fs.existsSync(videoPath)) throw new NotFoundException('Không tìm thấy video')
      videoSize = fs.statSync(videoPath).size
    } else videoSize = await s3Service.getFileSizeFromS3(MediaDirectories.Videos + videoName)
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
      const data = await s3Service.readS3FileSegment(
        MediaDirectories.Videos + videoName,
        start,
        end,
      )
      ;(data.Body as any).pipe(res)
    }
  }

  // Phục vụ file m3u8 HLS
  serveVideoM3u8: RequestHandler = (req, res, next) => {
    const id = req.params.id
    if (!IS_LOCAL)
      return s3Service.sendFileFromS3(res, MediaDirectories.VideoHLS + id + '/master.m3u8')
    const m3u8Path = getFilePath.VideoHLS(id, 'master.m3u8')
    return res.sendFile(m3u8Path, (err) => {
      if (err) next(new NotFoundException('Không tìm thấy file m3u8'))
    })
  }

  // Phục vụ playlist HLS
  serveVideoHlsPlaylist: RequestHandler = (req, res, next) => {
    const { id, v, segment } = req.params
    if (!IS_LOCAL)
      return s3Service.sendFileFromS3(res, `${MediaDirectories.VideoHLS}${id}/${v}/${segment}`)
    const playlistPath = getFilePath.VideoHLS(id, v, segment)
    return res.sendFile(playlistPath, (err) => {
      if (err) next(new NotFoundException('Không tìm thấy playlist HLS'))
    })
  }
}

export const mediaCtrl = new MediaCtrl()
