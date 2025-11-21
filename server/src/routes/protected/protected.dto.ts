import { PasswordSchema } from '@/lib/schema.common'
import z from 'zod'
import { UserSchema } from '../user/user.schema'

export const UpdateProfileSchema = UserSchema.pick({
  displayName: true,
  bio: true,
  phone: true,
}).partial()

export interface UpdateProfileDto extends z.infer<typeof UpdateProfileSchema> {}

export const ChangePassworSchema = z.object({
  oldPassword: z.string(),
  newPassword: PasswordSchema,
})
export interface ChangePassworDto extends z.infer<typeof ChangePassworSchema> {}
