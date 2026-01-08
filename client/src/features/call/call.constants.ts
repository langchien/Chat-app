import { envConfig } from '@/config/envConfig'

export const MEDIA_CONSTRAINTS = {
  VIDEO: {
    width: { min: 640, ideal: 1280, max: 1920 },
    height: { min: 480, ideal: 720, max: 1080 },
    frameRate: { ideal: 30, max: 60 },
  },
  AUDIO: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
    channelCount: 1, // Âm thanh mono
    latency: 0, // Tối ưu hóa âm thanh
  },
  SCREEN: {
    width: { ideal: 1920, max: 1920 },
    height: { ideal: 1080, max: 1080 },
    frameRate: { ideal: 30, max: 60 },
  },
} as const

export const ICE_SERVERS = {
  iceServers: envConfig.iceServers,
}
