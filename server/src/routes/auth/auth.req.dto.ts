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
  password: Password,
})
export interface IRegisterReqBodyDto extends z.infer<typeof RegisterReqBodyDto> {}

export const LoginReqBodyDto = z.object({
  email: createEmail(),
  password: z.string('Mật khẩu không được để trống'),
})
export interface ILoginReqBodyDto extends z.infer<typeof LoginReqBodyDto> {}

export const ResetPasswordReqBodyDto = z.object({
  password: Password,
})
export interface IResetPasswordReqBodyDto extends z.infer<typeof ResetPasswordReqBodyDto> {}
