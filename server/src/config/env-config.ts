import { logger } from '@/lib/logger.service'
import dotenv from 'dotenv'
import z from 'zod'

dotenv.config()

const JWT_SECRET_DEFAULT = 'your_jwt_secret_key_change_it'

const JwtConfig = z.object({
  secret: z.string(),
  expiresIn: z.coerce.number(),
})

const EnvConfig = z.object({
  port: z.coerce.number(),
  serverUri: z.string('SERVER_URI không được để trống'),
  clientUri: z.string('CLIENT_URI không được để trống'),
  nodeEnv: z.enum(['development', 'production', 'test']).optional(),
  mail: z.object({
    mailUser: z.string('MAIL_USER không được để trống'),
    mailPass: z.string('MAIL_PASS không được để trống'),
    mailFromAddress: z.string('MAIL_FROM_ADDRESS không được để trống'),
    mailService: z.enum(['gmail', 'ses'], {
      error: 'Dịch vụ mail (MAIL_SERVICE) không hợp lệ, chỉ chấp nhận gmail hoặc ses',
    }),
    awsAccessKeyId: z.string('AWS_ACCESS_KEY_ID không được để trống'),
    awsSecretAccessKey: z.string('AWS_SECRET_ACCESS_KEY không được để trống'),
    awsRegion: z.string('AWS_REGION không được để trống'),
  }),
  upload: z.object({
    provider: z.enum(['s3', 'local'], {
      error: 'Nhà cung cấp upload (UPLOAD_PROVIDER) không hợp lệ, chỉ chấp nhận s3 hoặc local',
    }),
    awsAccessKeyId: z.string('AWS_UPLOAD_ACCESS_KEY_ID không được để trống'),
    awsSecretAccessKey: z.string('AWS_UPLOAD_SECRET_ACCESS_KEY không được để trống'),
    awsRegion: z.string('AWS_UPLOAD_REGION không được để trống'),
    s3BucketName: z.string('S3_BUCKET_NAME không được để trống'),
  }),
  googleOAuth2: z.object({
    googleClientId: z.string('GOOGLE_CLIENT_ID không được để trống'),
    googleClientSecret: z.string('GOOGLE_CLIENT_SECRET không được để trống'),
    appClientRedirectUri: z.url('APP_CLIENT_REDIRECT_URI không hợp lệ'),
  }),
  jwt: z.object({
    accessToken: JwtConfig,
    refreshToken: JwtConfig,
    otpToken: JwtConfig,
  }),
  redisUrl: z.string('REDIS_URL không được để trống'),
})
export interface IEnvConfigInput extends z.input<typeof EnvConfig> {}

export const envConfigInput: IEnvConfigInput = {
  port: process.env.PORT!,
  serverUri: process.env.SERVER_URI!,
  clientUri: process.env.CLIENT_URI!,
  nodeEnv: process.env.NODE_ENV as 'development' | 'production' | 'test' | undefined,
  mail: {
    mailUser: process.env.GMAIL_MAIL_USER!,
    mailPass: process.env.GMAIL_MAIL_PASS!,
    mailFromAddress: process.env.MAIL_FROM_ADDRESS!,
    mailService: (process.env.MAIL_SERVICE as 'gmail' | 'ses')!,
    awsAccessKeyId: process.env.AWS_MAIL_ACCESS_KEY_ID!,
    awsSecretAccessKey: process.env.AWS_MAIL_SECRET_ACCESS_KEY!,
    awsRegion: process.env.AWS_MAIL_REGION!,
  },
  upload: {
    provider: process.env.UPLOAD_PROVIDER as 's3' | 'local',
    awsAccessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    awsSecretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
    awsRegion: process.env.AWS_S3_REGION!,
    s3BucketName: process.env.S3_BUCKET_NAME!,
  },
  googleOAuth2: {
    googleClientId: process.env.GOOGLE_CLIENT_ID!,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    appClientRedirectUri: process.env.APP_CLIENT_REDIRECT_URI!,
  },
  jwt: {
    accessToken: {
      secret: process.env.JWT_ACCESS_SECRET ?? JWT_SECRET_DEFAULT,
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? 15 * 60,
    },
    refreshToken: {
      secret: process.env.JWT_REFRESH_SECRET ?? JWT_SECRET_DEFAULT,
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? 7 * 24 * 60 * 60,
    },
    otpToken: {
      secret: process.env.JWT_OTP_SECRET ?? JWT_SECRET_DEFAULT,
      expiresIn: process.env.JWT_OTP_EXPIRES_IN ?? 10 * 60,
    },
  },
  redisUrl: process.env.REDIS_URL!,
}

const verifyEnvConfig = () => {
  try {
    return EnvConfig.parse(envConfigInput)
  } catch (error) {
    logger.error(
      'Lỗi thiếu các biến môi trường, vui lòng kiểm tra lại file .env, xem hướng dẫn ở .env.example và @/config/env-config.ts',
    )
    if (error instanceof z.ZodError) {
      for (const issue of error.issues) {
        logger.warn(`- ${issue.message}`)
      }
    }
    process.exit(1)
  }
}

export const envConfig = verifyEnvConfig()
