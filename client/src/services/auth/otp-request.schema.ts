import { createEmail, createString, Otp } from '@/lib/schema.common'
import z from 'zod'

export enum OtpType {
  VerifyEmail = 'VerifyEmail',
  ResetPasswordReqBodyDto = 'ResetPassword',
}

export const OtpRequest = z.object({
  id: createString('id'),
  email: createEmail(),
  otp: Otp,
  type: z.enum(OtpType),
  iat: z.date(),
  exp: z.date(),
})