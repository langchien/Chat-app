import { envConfig } from '@/config/envConfig'
import {
  AppException,
  HTTP_STATUS_CODE,
  UnprocessableEntityException,
  type ResponseErrorPayload,
  type ValidationErrorPayload,
} from '@/lib/request/request.type'
import axios, { AxiosError, type AxiosResponse } from 'axios'

const TEST_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTEzOTdhM2MwMzAyZTI5OTBhYTBkMDgiLCJlbWFpbCI6Imxhbmd0aWVuazRAZ21haWwuY29tIiwianRpIjoiNjkyMzNhMzA1NzkxMTk4YTZhZjM0MWJlIiwiaWF0IjoxNzYzOTE2MzM2LCJleHAiOjE3NzI5MTYzMzZ9.fov855IYVsVGv1FKH4Eh0XpQLX-rkG_RqgfdpZ9GYgk'

export const httpRequest = axios.create({
  baseURL: envConfig.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${TEST_ACCESS_TOKEN}`,
  },
  withCredentials: true,
})

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
