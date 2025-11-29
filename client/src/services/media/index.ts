import { uploadRequest } from '@/lib/request'
import { API_ROUTES } from '../request.interface'

class MediaUploadRequest {
  multipartFormUpload(chatId: string, content: string, files: File[]) {
    // cho phép images, videos, files
    const images = files.filter((file) => file.type.startsWith('image/'))
    const videos = files.filter((file) => file.type.startsWith('video/'))
    const otherFiles = files.filter(
      (file) => !file.type.startsWith('image/') && !file.type.startsWith('video/'),
    )
    const uploadFields: { file: File[]; key: string }[] = []
    if (images.length > 0) {
      uploadFields.push({ file: images, key: 'images' })
    }
    if (videos.length > 0) {
      uploadFields.push({ file: videos, key: 'videos' })
    }
    if (otherFiles.length > 0) {
      uploadFields.push({ file: otherFiles, key: 'files' })
    }
    const formData = new FormData()
    formData.append('contents', content)
    uploadFields.forEach(({ file, key }) => {
      file.forEach((f) => formData.append(key, f))
    })
    return uploadRequest.post(`${API_ROUTES.MEDIA}/chats/${chatId}`, formData)
  }

  uploadSingleVideoToHls(file: File, chatId: string, content?: string) {
    const formData = new FormData()
    formData.append('video', file)
    if (content) formData.append('contents', content)
    return uploadRequest.post(`${API_ROUTES.MEDIA}/video_hls/chats/${chatId}`, formData)
  }
}

export const mediaUploadRequest = new MediaUploadRequest()
