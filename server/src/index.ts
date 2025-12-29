import { envConfig } from '@/config/env-config'
import { handlerExceptionDefault } from '@/core/handler-exception'
import { localFileService } from '@/core/local-file.service'
import { apiRateLimiter } from '@/core/rate-limit.middleware'
import { API_ROUTES } from '@/core/routes.const'
import { prismaService } from '@/lib/database'
import { logger } from '@/lib/logger.service'
import { maillerService } from '@/lib/mailler.service'
import { redisService } from '@/lib/redis.service'
import { s3Service } from '@/lib/s3.service'
import { authRouter } from '@/routes/auth/auth.route'
import { chatRouter } from '@/routes/chat/chat.route'
import { friendRoute } from '@/routes/friend/friend.route'
import { mediaRouter } from '@/routes/media/media.route'
import { messageRouter } from '@/routes/message/message.route'
import notificationRouter from '@/routes/notification'
import { oauth2Router } from '@/routes/oauth2/oauth2.route'
import { protectedRouter } from '@/routes/protected/protected.route'
import { userRouter } from '@/routes/user/user.route'
import { app, httpServer } from '@/socket'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { ffmpegService } from './routes/media/ffmpeg.service'

const main = async () => {
  await localFileService.initFolder() // khởi tạo các thư mục cần thiết trước khi chạy ứng dụng
  // Khởi động các dịch vụ song song
  await Promise.all([
    prismaService.verifyConnection(),
    redisService.connect(), // Kết nối đến Redis
    maillerService.verifyConnection(), // Xác minh kết nối mailer
    s3Service.verifyS3Connection(), // Xác minh kết nối S3
    ffmpegService.verifyFFmpeg(),
  ])

  app.use(cookieParser()) // Middleware để parser cookie
  app.use(express.json()) // Middleware để parser JSON body
  app.use(apiRateLimiter) // Rate limiter cho toàn bộ API
  // cho phép truy cập từ các nguồn khác (CORS)
  app.use(
    cors({
      credentials: true, // Cho phép gửi cookie
      origin: envConfig.clientUri, // Chỉ cho phép truy cập từ clientUri
    }),
  )
  // Đăng ký các route
  app.use(API_ROUTES.USER, userRouter)
  app.use(API_ROUTES.AUTH, authRouter)
  app.use(API_ROUTES.OAUTH, oauth2Router)
  app.use(API_ROUTES.PROTECTED, protectedRouter)
  app.use(API_ROUTES.CHAT, chatRouter)
  app.use(API_ROUTES.MESSAGE, messageRouter)
  app.use(API_ROUTES.MEDIA, mediaRouter)
  app.use(API_ROUTES.FRIEND, friendRoute)
  app.use(API_ROUTES.NOTIFICATION, notificationRouter)

  // Phải đặt sau tất cả các route khác
  app.use(handlerExceptionDefault) // Middleware xử lý ngoại lệ

  httpServer.listen(envConfig.port, () => {
    logger.info(`Click http://localhost:${envConfig.port} để truy cập ứng dụng`)
  })
}
main()
