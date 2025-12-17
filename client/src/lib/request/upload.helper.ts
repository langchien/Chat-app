import { envConfig } from '@/config/envConfig'
import { useAuthStore } from '@/stores/auth.store'
import axios from 'axios'
import { responseError } from './axios.helper'

export const uploadRequest = axios.create({
  baseURL: envConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
  withCredentials: true,
})

uploadRequest.interceptors.request.use(async (config) => {
  const accessToken = useAuthStore.getState().accessToken
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

uploadRequest.interceptors.response.use((response) => {
  return response
}, responseError)
