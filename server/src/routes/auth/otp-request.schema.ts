import { createEmailSchema, createStringSchema, OtpSchema } from '@/lib/schema.common'
import z from 'zod'

export enum OtpType {
  VerifyEmail = 'VERIFY_EMAIL',
  ForgotPassword = 'FORGOT_PASSWORD',
}

export const OtpRequestSchema = z.object({
  _id: createStringSchema('id'),
  email: createEmailSchema(),
  otp: OtpSchema,
  type: z.enum(OtpType),
  iat: z.date(),
  exp: z.date(),
})

export const IOTPRequestCollectionSchema = OtpRequestSchema.partial({ _id: true })

export interface IOtpRequest extends z.infer<typeof OtpRequestSchema> {}
export interface IOtpRequestCollection extends z.infer<typeof IOTPRequestCollectionSchema> {}
