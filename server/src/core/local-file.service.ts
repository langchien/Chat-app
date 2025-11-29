import { envConfig } from '@/config/env-config'
import { MediaType } from '@/routes/media/media.schema'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fs } from 'zx'
import { API_ROUTES } from './routes.const'

export const UPLOAD_LOCAL_DIR = 'uploads/'

export const MediaDirectories: Record<MediaType, string> = {
  file: 'files/',
  image: 'images/',
  video: 'videos/',
  video_hls: 'videos_hls/',
  audio: 'audios/',
}

export type MediaDirectory = (typeof MediaDirectories)[keyof typeof MediaDirectories]

class LocalFileService {
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

  getFilePath = (mediaType: MediaType, ...inputs: string[]) => {
    return path.resolve(UPLOAD_LOCAL_DIR, MediaDirectories[mediaType], ...inputs)
  }

  getUrlMedia = (mediaType: MediaType, ...inputs: string[]) => {
    const isStatic = MediaType.video_hls !== mediaType
    const API_PATH = isStatic ? '/static/' : '/stream/'
    const MEDIA_BASE_URL = envConfig.serverUri + API_ROUTES.MEDIA + API_PATH
    return MEDIA_BASE_URL + mediaType + '/' + inputs.join('/')
  }
}
export const localFileService = new LocalFileService()
