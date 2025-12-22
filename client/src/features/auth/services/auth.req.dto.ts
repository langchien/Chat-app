import { User } from '@/features/user/services/user.schema'
import { createEmail, Otp, Password } from '@/lib/schema.common'
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
})
  .extend({
    password: Password,
    confirmPassword: z.string('Xác nhận mật khẩu không được để trống'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu và xác nhận mật khẩu không khớp',
    path: ['confirmPassword'],
  })
export interface IRegisterReqBodyDto extends z.infer<typeof RegisterReqBodyDto> {}

export const LoginReqBodyDto = z.object({
  email: createEmail(),
  password: z.string('Mật khẩu không được để trống'),
})
export interface ILoginReqBodyDto extends z.infer<typeof LoginReqBodyDto> {}

export const ResetPasswordReqBodyDto = z
  .object({
    password: Password,
    confirmPassword: z.string('Xác nhận mật khẩu không được để trống'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu và xác nhận mật khẩu không khớp',
    path: ['confirmPassword'],
  })
export interface IResetPasswordReqBodyDto extends z.infer<typeof ResetPasswordReqBodyDto> {}
