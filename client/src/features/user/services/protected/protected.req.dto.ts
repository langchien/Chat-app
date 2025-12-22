import { Password } from '@/lib/schema.common'
import z from 'zod'
import { User } from '../user.schema'

export const UpdateProfileBodyDto = User.pick({
  displayName: true,
  bio: true,
  phone: true,
  avatarUrl: true,
}).partial()

export const ChangePassworBodyDto = z
  .object({
    oldPassword: z.string(),
    newPassword: Password,
  })
  .extend({
    confirmPassword: z.string('Xác nhận mật khẩu không được để trống'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Mật khẩu và xác nhận mật khẩu không khớp',
    path: ['confirmPassword'],
  })

export interface IUpdateProfileBodyDto extends z.infer<typeof UpdateProfileBodyDto> {}
export interface IChangePassworBodyDto extends z.infer<typeof ChangePassworBodyDto> {}
