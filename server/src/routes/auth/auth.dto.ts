import { createEmailSchema, OtpSchema, PasswordSchema } from '@/lib/schema.common'
import { UserSchema } from '@/routes/user/user.schema'
import z from 'zod'

export const SendOtpSchema = z.object({
  email: createEmailSchema(),
})
export interface SendOtpDto extends z.infer<typeof SendOtpSchema> {}

export const VerifyOtpSchema = z.object({
  email: createEmailSchema(),
  otp: OtpSchema,
})
export interface VerifyOtpDto extends z.infer<typeof VerifyOtpSchema> {}

export const RegisterSchema = UserSchema.pick({
  username: true,
  displayName: true,
  phone: true,
  avatarUrl: true,
  bio: true,
}).extend({
  registerToken: z.string('registerToken không được để trống'),
  password: PasswordSchema,
})
export interface RegisterDto extends z.infer<typeof RegisterSchema> {}

export const LoginSchema = z.object({
  email: createEmailSchema(),
  password: z.string('Mật khẩu không được để trống'),
})
export interface LoginDto extends z.infer<typeof LoginSchema> {}

export const RefreshTokenSchema = z.object({
  refreshToken: z.string('refreshToken không được để trống'),
})
export interface RefreshTokenDto extends z.infer<typeof RefreshTokenSchema> {}

export const ForgotPasswordSchema = z.object({
  password: PasswordSchema,
  forgotPasswordToken: z.string('forgotPasswordToken không được để trống'),
})
export interface ForgotPasswordDto extends z.infer<typeof ForgotPasswordSchema> {}
