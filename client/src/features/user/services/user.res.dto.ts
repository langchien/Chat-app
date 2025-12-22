import z from 'zod'
import { User } from './user.schema'

export const UserResDto = User.omit({
  hashedPassword: true,
})
export interface IUserResDto extends z.infer<typeof UserResDto> {}