import { createStringId, Password } from '@/lib/schema.common'
import z from 'zod'
import { User } from './user.schema'

export const CreateUserReqBodyDto = User.pick({
  username: true,
  email: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
  phone: true,
}).extend({
  password: Password,
})

export const UpdateUserReqBodyDto = CreateUserReqBodyDto.omit({
  password: true,
}).partial()

export const UserIdReqParamsDto = z.object({
  userId: createStringId('userId'),
})

export const UserSearchReqQueryDto = z.object({
  q: z.string().min(1).optional(),
})

export interface ICreateUserReqBodyDto extends z.infer<typeof CreateUserReqBodyDto> {}
export interface IUpdateUserReqBodyDto extends z.infer<typeof UpdateUserReqBodyDto> {}
export interface IUserIdReqParamsDto extends z.infer<typeof UserIdReqParamsDto> {}
export interface IUserSearchReqQueryDto extends z.infer<typeof UserSearchReqQueryDto> {}
