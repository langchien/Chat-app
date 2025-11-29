import { Password } from '@/lib/schema.common'
import z from 'zod'
import { User } from '../user/user.schema'

export const UpdateProfileBodyDto = User.pick({
  displayName: true,
  bio: true,
  phone: true,
  avatarUrl: true,
}).partial()

export const ChangePassworBodyDto = z.object({
  oldPassword: z.string(),
  newPassword: Password,
})

export interface IUpdateProfileBodyDto extends z.infer<typeof UpdateProfileBodyDto> {}
export interface IChangePassworBodyDto extends z.infer<typeof ChangePassworBodyDto> {}
