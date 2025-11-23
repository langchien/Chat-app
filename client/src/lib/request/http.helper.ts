// import {
//   AppException,
//   REQ_METHOD,
//   STATUS_CODE,
//   UnprocessableEntityException,
//   type CustomRequestInit,
// } from '@/types/request-exception'
// import { envConfig } from '@/config/envConfig'

// const DEFAULT_CONTENT_TYPE_JSON = 'application/json'
// const DEFAULT_ERROR_MESSAGE = 'Lỗi không xác định'

// const handleRequest = async <T>(method: REQ_METHOD, url: string, option?: CustomRequestInit) => {
//   const body = option?.body ? JSON.stringify(option.body) : undefined
//   const baseHeaders = {
//     'Content-Type': DEFAULT_CONTENT_TYPE_JSON,
//   }
//   const envBaseUrl = envConfig.apiBaseUrl
//   const baseUrl = option?.baseUrl ?? envBaseUrl
//   // Normalize to avoid duplicate or missing slashes
//   const normalizedBase = baseUrl.replace(/\/+$/, '')
//   const normalizedPath = url.startsWith('/') ? url : `/${url}`
//   const fullUrl = `${normalizedBase}${normalizedPath}`
//   const res = await fetch(fullUrl, {
//     ...option,
//     method,
//     body,
//     headers: {
//       ...baseHeaders,
//       ...option?.headers,
//     },
//   })

//   if (res.status === STATUS_CODE.NO_CONTENT) {
//     return null as T
//   }

//   const contentType = res.headers.get('Content-Type')
//   let payload: any = null
//   if (contentType && contentType.includes(DEFAULT_CONTENT_TYPE_JSON)) {
//     payload = await res.json()
//   }

//   if (res.ok) {
//     return payload as T
//   }
//   // Có thể mở rộng thêm các lỗi khác ở đây, hiện tại chỉ cần xử lý 422 và các lỗi còn lại
//   switch (res.status) {
//     case STATUS_CODE.UNPROCESSABLE_ENTITY: {
//       throw new UnprocessableEntityException(payload)
//     }
//     default: {
//       throw new AppException({
//         message: payload?.message ?? DEFAULT_ERROR_MESSAGE,
//         statusCode: res.status,
//       })
//     }
//   }
// }

// export interface HttpOption extends Omit<CustomRequestInit, 'body'> {}

// export const httpRequest = {
//   get: <T>(url: string, option?: CustomRequestInit) =>
//     handleRequest<T>(REQ_METHOD.GET, url, option),
//   post: <T>(url: string, option?: CustomRequestInit) =>
//     handleRequest<T>(REQ_METHOD.POST, url, option),
//   put: <T>(url: string, option?: CustomRequestInit) =>
//     handleRequest<T>(REQ_METHOD.PUT, url, option),
//   patch: <T>(url: string, option?: CustomRequestInit) =>
//     handleRequest<T>(REQ_METHOD.PATCH, url, option),
//   delete: <T>(url: string, option?: CustomRequestInit) =>
//     handleRequest<T>(REQ_METHOD.DELETE, url, option),
// }
