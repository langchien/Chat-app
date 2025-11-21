import { createStringIdSchema, PasswordSchema } from '@/lib/schema.common'
import z from 'zod'
import { UserCollectionSchema } from './user.schema'

// reqest body dto
export const CreateUserReqBodySchema = UserCollectionSchema.omit({
  hashedPassword: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  password: PasswordSchema,
})

export const UpdateUserReqBodySchema = CreateUserReqBodySchema.omit({
  password: true,
}).partial()

// request params dto
export const UserIdReqParamsDtoSchema = z.object({
  userId: createStringIdSchema('userId'),
})

// request query dto
export const UserSearchReqQueryDtoSchema = z.object({
  q: z.string().min(1).optional(),
})

export interface ICreateUserReqBodyDto extends z.infer<typeof CreateUserReqBodySchema> {}
export interface IUpdateUserReqBodyDto extends z.infer<typeof UpdateUserReqBodySchema> {}
export interface IUserIdReqParamsDto extends z.infer<typeof UserIdReqParamsDtoSchema> {}
export interface IUserSearchReqQueryDto extends z.infer<typeof UserSearchReqQueryDtoSchema> {}
