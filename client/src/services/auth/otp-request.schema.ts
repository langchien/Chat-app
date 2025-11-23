import { createEmail, createString, Otp } from '@/lib/schema.common'
import z from 'zod'

export enum OtpType {
  VerifyEmail = 'VERIFY_EMAIL',
  ForgotPasswordReqBodyDto = 'FORGOT_PASSWORD',
}

export const OtpRequest = z.object({
  _id: createString('id'),
  email: createEmail(),
  otp: Otp,
  type: z.enum(OtpType),
  iat: z.date(),
  exp: z.date(),
})
