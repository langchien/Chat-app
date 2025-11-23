import { envConfig } from '@/config/envConfig'
import axios, { type AxiosProgressEvent } from 'axios'

export const uploadRequest = axios.create({
  baseURL: envConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
})

export async function uploadFile(
  path: string,
  key: string,
  files: File[],
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void,
) {
  const formData = new FormData()
  files.forEach((file) => formData.append(key, file))
  const response = await uploadRequest.post(path, formData, {
    onUploadProgress,
  })

  return response.data
}
