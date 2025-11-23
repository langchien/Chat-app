import { createEmail, Otp, Password } from '@/lib/schema.common'
import { User } from '@/routes/user/user.schema'
import z from 'zod'

export const SendOtpReqBodyDto = z.object({
  email: createEmail(),
})
export interface ISendOtpReqBodyDto extends z.infer<typeof SendOtpReqBodyDto> {}

export const VerifyOtp = z.object({
  email: createEmail(),
  otp: Otp,
})
export interface IVerifyOtpDto extends z.infer<typeof VerifyOtp> {}

export const RegisterReqBodyDto = User.pick({
  username: true,
  displayName: true,
  phone: true,
  avatarUrl: true,
  bio: true,
}).extend({
  registerToken: z.string('registerToken không được để trống'),
  password: Password,
})
export interface IRegisterReqBodyDto extends z.infer<typeof RegisterReqBodyDto> {}

export const LoginReqBodyDto = z.object({
  email: createEmail(),
  password: z.string('Mật khẩu không được để trống'),
})
export interface ILoginReqBodyDto extends z.infer<typeof LoginReqBodyDto> {}

export const RefreshTokenReqBodyDto = z.object({
  refreshToken: z.string('refreshToken không được để trống'),
})
export interface IRefreshTokenReqBodyDto extends z.infer<typeof RefreshTokenReqBodyDto> {}

export const ForgotPasswordReqBodyDto = z.object({
  password: Password,
  forgotPasswordToken: z.string('forgotPasswordToken không được để trống'),
})
export interface IForgotPasswordReqBodyDto extends z.infer<typeof ForgotPasswordReqBodyDto> {}
