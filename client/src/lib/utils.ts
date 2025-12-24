import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * @description Lấy ký tự đầu tiên và ký tự cuối cùng
 */
export function getInitials(name: string) {
  const splitName = name.split(' ')
  if (splitName.length === 1) return splitName[0][0].toUpperCase()
  return `${splitName[0][0].toUpperCase()}${splitName[1][0].toUpperCase()}`
}

/**
 * @description trả về thời gian đã trôi qua từ thời điểm đã cho đến hiện tại dưới dạng chuỗi dễ đọc
 * @param date Ngày cần tính thời gian đã trôi qua
 * @returns Chuỗi thời gian đã trôi qua
 */
export function formatTimeAgo(createdAt: string | Date): string {
  const date = new Date(createdAt)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) {
    return `${seconds} giây trước`
  } else if (minutes < 60) {
    return `${minutes} phút trước`
  } else if (hours < 24) {
    return `${hours} giờ trước`
  } else {
    return `${days} ngày trước`
  }
}

export function formatMessageTime(timestamp: string) {
  const date = new Date(timestamp)
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${day}/${month} ${hours}:${minutes}`
}

export function generateVideoThumbnail(file: File, seekTo = 0): Promise<string> {
  return new Promise((resolve, reject) => {
    const videoPlayer = document.createElement('video')
    videoPlayer.setAttribute('src', URL.createObjectURL(file))
    videoPlayer.load()
    videoPlayer.addEventListener('error', (ex) => {
      reject(ex)
    })
    videoPlayer.addEventListener('loadedmetadata', () => {
      // seek to user defined timestamp (in seconds) if possible
      if (videoPlayer.duration < seekTo) {
        seekTo = videoPlayer.duration
      }
      // delay seeking or else 'seeked' event won't fire on some browsers
      setTimeout(() => {
        videoPlayer.currentTime = seekTo
      }, 200)
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas')
        canvas.width = videoPlayer.videoWidth
        canvas.height = videoPlayer.videoHeight
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height)
        URL.revokeObjectURL(videoPlayer.src)
        resolve(canvas.toDataURL('image/jpeg'))
      })
    })
  })
}
