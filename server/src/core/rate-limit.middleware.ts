import { envConfig } from '@/config/env-config'
import { TooManyRequestsException } from '@/core/exceptions'
import rateLimit, { Options } from 'express-rate-limit'

/**
 * Tạo middleware rate limiting với custom error handler
 * @param options - Cấu hình rate limit
 * @returns Middleware rate limiter
 */
export const createRateLimiter = (options?: Partial<Options>) => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 requests mỗi windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skipSuccessfulRequests: false, // Đếm cả request thành công
    skipFailedRequests: false, // Đếm cả request thất bại
    ...options,
    handler: (req, res, next) => {
      if (envConfig.nodeEnv === 'development') return next() // Bỏ qua rate limiting trong development để dễ test
      throw new TooManyRequestsException(options?.message)
    },
  })
}

/**
 * Rate limiter cho auth routes (login, register, etc.)
 * Giới hạn nghiêm ngặt hơn để tránh brute force
 */
export const authRateLimiter = createRateLimiter({
  max: 5, // Giới hạn 5 requests mỗi 15 phút
  message: 'Quá nhiều yêu cầu xác thực, vui lòng thử lại sau 15 phút',
})

export const emailRateLimiter = createRateLimiter({
  windowMs: 5 * 60 * 1000, // 5 phút
  max: 3, // Giới hạn 3 requests mỗi 5 phút
  message: 'Bạn đã gửi quá nhiều yêu cầu, vui lòng thử lại sau 5 phút',
})

/**
 * Rate limiter chung cho API
 */
export const apiRateLimiter = createRateLimiter({
  max: 100, // Giới hạn 100 requests mỗi 15 phút
  message: 'Quá nhiều yêu cầu từ IP này, vui lòng thử lại sau',
})
