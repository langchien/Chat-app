import z from 'node_modules/zod/v4/classic/external.cjs'
import { User } from './user.schema'

export const UserCollection = User.partial({ id: true })

export const UpdateUser = User.partial().omit({
  id: true,
  email: true,
  createdAt: true,
})

export interface IUser extends z.infer<typeof User> {}
export interface IUserCollection extends z.infer<typeof UserCollection> {}
export interface IUpdateUserInput extends z.input<typeof UpdateUser> {}
export interface ICreateUserInput extends z.input<typeof UserCollection> {}
