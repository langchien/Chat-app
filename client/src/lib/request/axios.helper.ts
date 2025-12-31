import { envConfig } from '@/config/envConfig'
import {
  AppException,
  HTTP_STATUS_CODE,
  UnprocessableEntityException,
  type ResponseErrorPayload,
  type ValidationErrorPayload,
} from '@/lib/request/request.type'
import { useAuthStore } from '@/stores/auth.store'
import axios, { type AxiosError, type AxiosResponse } from 'axios'

export const httpRequest = axios.create({
  baseURL: envConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

// --- BIẾN ĐỂ XỬ LÝ CONCURRENCY (QUAN TRỌNG) ---
// Biến đánh dấu đang trong quá trình refresh token
let isRefreshing = false
// Hàng đợi chứa các request bị lỗi 401 đang chờ token mới
let failedQueue: any[] = []

// Hàm xử lý hàng đợi sau khi refresh xong (thành công hoặc thất bại)
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

// Tự động thêm token vào header của request
httpRequest.interceptors.request.use(async (config) => {
  // const isCreateMessage = config.url?.endsWith('/messages') && config.method === 'post'
  // if (!isCreateMessage) await fackeDelay(500)
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response Interceptor

export const responseError = async (error: AxiosError) => {
  const originalRequest = error.config as any

  // Nếu lỗi không phải 401 hoặc request này đã được retry -> Trả lỗi luôn
  // Hoặc nếu request có header x-skip-auth-refresh -> Trả lỗi luôn (để tránh loop khi login sai)
  if (
    error.response?.status !== 401 ||
    originalRequest._retry ||
    originalRequest.headers?.['x-skip-auth-refresh']
  ) {
    if (error.response && error.response.data) {
      const response = error.response.data as ResponseErrorPayload
      if (error.response.status === HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY) {
        return Promise.reject(new UnprocessableEntityException(response as ValidationErrorPayload))
      }
      return Promise.reject(new AppException(response))
    }
    return Promise.reject(error)
  }

  // --- LOGIC REFRESH TOKEN ---
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({
        resolve: (token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          resolve(httpRequest(originalRequest))
        },
        reject: (err: any) => {
          reject(err)
        },
      })
    })
  }

  // Nếu chưa có ai refresh, bắt đầu refresh
  originalRequest._retry = true
  isRefreshing = true

  try {
    // Gọi API refresh token (Backend sẽ đọc cookie refreshToken)
    // Lưu ý: Không dùng instance 'httpRequest' để gọi cái này để tránh lặp vô tận
    const response = await axios.post<{
      accessToken: string
    }>(
      `${envConfig.apiBaseUrl}/auth/refresh-token`,
      {},
      { withCredentials: true }, // Bắt buộc để gửi cookie đi
    )
    const { accessToken } = response.data
    useAuthStore.getState().setAccessToken(accessToken)
    processQueue(null, accessToken)
    originalRequest.headers.Authorization = `Bearer ${accessToken}`
    return httpRequest(originalRequest)
  } catch (refreshError) {
    processQueue(refreshError, null)
    useAuthStore.getState().signOut()
    return Promise.reject(refreshError)
  } finally {
    isRefreshing = false
  }
}

httpRequest.interceptors.response.use((response: AxiosResponse) => response, responseError)
