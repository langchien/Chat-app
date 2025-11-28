import { envConfig } from '@/config/env-config'
import { existsSync } from 'fs'
import { mkdir } from 'fs/promises'
import path from 'path'
import { fs } from 'zx'
import { API_ROUTES } from './routes.const'

export const UPLOAD_LOCAL_DIR = 'uploads/'

export const MediaDirectories = {
  file: 'files/',
  image: 'images/',
  video: 'videos/',
  video_hls: 'videos_hls/',
} as const

export type KeyDirectory = keyof typeof MediaDirectories
export type MediaDirectory = (typeof MediaDirectories)[KeyDirectory]

const MEDIA_BASE_URL = envConfig.serverUri + API_ROUTES.MEDIA + '/'
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
  private createMediaPathResolver<T extends string>(
    base: string,
    dirs: Record<T, string>,
    joinFn: (base: string, dir: string, ...inputs: string[]) => string,
  ): Record<T, (...inputs: string[]) => string> {
    return Object.keys(dirs).reduce(
      (acc, key) => {
        acc[key as T] = (...inputs: string[]) => joinFn(base, dirs[key as T], ...inputs)
        return acc
      },
      {} as Record<T, (...inputs: string[]) => string>,
    )
  }

  getFilePath = this.createMediaPathResolver(
    UPLOAD_LOCAL_DIR,
    MediaDirectories,
    (base, dir, ...inputs) => path.resolve(base, dir, ...inputs),
  )
  getUrlMedia = this.createMediaPathResolver(
    MEDIA_BASE_URL,
    MediaDirectories,
    (base, dir, ...inputs) => base + dir + inputs.join(''),
  )
}
export const localFileService = new LocalFileService()
