import z from 'zod'
import { UserSchema } from './user.schema'

export const UserResSchema = UserSchema.omit({
  hashedPassword: true,
  friends: true,
})
export interface IUserResDto extends z.infer<typeof UserResSchema> {}
