import { envConfig } from '@/config/env-config'
import { APP_ROUTES } from '@/core/routes.const'
import path from 'path'

export const UPLOAD_LOCAL_DIR = 'uploads/'

export enum MediaDirectories {
  Temp = 'temp/',
  Files = 'files/',
  Images = 'images/',
  Videos = 'videos/',
  VideoHLS = 'videos-hls/',
}

const MEDIA_BASE_URL = envConfig.serverUri + APP_ROUTES.MEDIA + '/'

function createMediaPathResolver<T extends string>(
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

export const getFilePath = createMediaPathResolver(
  UPLOAD_LOCAL_DIR,
  MediaDirectories,
  (base, dir, ...inputs) => path.resolve(base, dir, ...inputs),
)

export const getUrlMedia = createMediaPathResolver(
  MEDIA_BASE_URL,
  MediaDirectories,
  (base, dir, ...inputs) => base + dir + inputs.join(''),
)
