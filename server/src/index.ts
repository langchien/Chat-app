import { envConfig } from '@/config/env-config'
import { handlerExceptionDefault } from '@/core/handler-exception'
import { apiRateLimiter } from '@/core/rate-limit.middleware'
import { API_ROUTES } from '@/core/routes.const'
import { databaseService, initIndexesDb } from '@/lib/database.service'
import { logger } from '@/lib/logger.service'
import { maillerService } from '@/lib/mailler.service'
import { redisService } from '@/lib/redis.service'
import { s3Service } from '@/lib/s3.service'
import { initSocketService } from '@/lib/socket.service'
import { authRouter } from '@/routes/auth/auth.route'
import { chatRouter } from '@/routes/chat/chat.route'
import { mediaRouter } from '@/routes/media/media.route'
import { uploadService } from '@/routes/media/upload.service'
import { messageRouter } from '@/routes/message/message.route'
import { oauth2Router } from '@/routes/oauth2/oauth2.router'
import { protectedRouter } from '@/routes/protected/protected.route'
import { userRouter } from '@/routes/user/user.route'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import express from 'express'
import { createServer } from 'http'

const main = async () => {
  await uploadService.initFolder() // khởi tạo các thư mục cần thiết trước khi chạy ứng dụng
  const app = express()
  const httpServer = createServer(app)
  initSocketService(httpServer)
  // Khởi động các dịch vụ song song
  await Promise.all([
    databaseService.connect(), // Kết nối đến database
    redisService.connect(), // Kết nối đến Redis
    maillerService.verifyConnection(), // Xác minh kết nối mailer
    s3Service.verifyS3Connection(), // Xác minh kết nối S3
  ])
  await initIndexesDb() // Khởi tạo các indexes cho database

  app.use(cookieParser()) // Middleware để phân tích cookie
  app.use(express.json()) // Middleware để phân tích JSON body
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
  // Phải đặt sau tất cả các route khác
  app.use(handlerExceptionDefault) // Middleware xử lý ngoại lệ

  httpServer.listen(envConfig.port, () => {
    logger.info(`Click http://localhost:${envConfig.port} để truy cập ứng dụng`)
  })
}
main()
