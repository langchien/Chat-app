import { envConfig } from '@/config/envConfig'
import { useAuthStore } from '@/hooks/stores/auth.store'
import {
  AppException,
  HTTP_STATUS_CODE,
  UnprocessableEntityException,
  type ResponseErrorPayload,
  type ValidationErrorPayload,
} from '@/lib/request/request.type'
import axios, { AxiosError, type AxiosResponse } from 'axios'

export const httpRequest = axios.create({
  baseURL: envConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const fackeDelay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
// Tự động thêm token vào header của request

httpRequest.interceptors.request.use(async (config) => {
  if (config.method === 'get') await fackeDelay(500)
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Response Interceptor
const onResponseSuccess = (response: AxiosResponse<any, any, {}>) => {
  return response
}

const onResponseFailure = (error: AxiosError) => {
  if (error.response && error.response.data) {
    const response = error.response.data as ResponseErrorPayload
    if (error.status === HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY)
      throw new UnprocessableEntityException(response as ValidationErrorPayload)
    throw new AppException(response)
  }
  throw error
}

httpRequest.interceptors.response.use(onResponseSuccess, onResponseFailure)
