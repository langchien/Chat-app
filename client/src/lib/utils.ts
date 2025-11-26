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
