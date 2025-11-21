import {
  BaseCollectionSchema,
  createEmailSchema,
  createNameSchema,
  createObjectIdSchema,
  createStringSchema,
  UsernameSchema,
} from '@/lib/schema.common'
import z from 'zod'

export const UserSchema = BaseCollectionSchema.extend({
  username: UsernameSchema,
  email: createEmailSchema(),
  displayName: createNameSchema('Tên hiển thị', 100),
  hashedPassword: z.string(),
  avatarId: createObjectIdSchema('avatarId').optional(),
  avatarUrl: z.url().optional(),
  bio: createStringSchema('Bio', 300).optional(),
  phone: createStringSchema('Sổ điện thoại', 15).optional(),
  friends: z.array(createObjectIdSchema('FriendId')).default([]),
})

export const UserCollectionSchema = UserSchema.partial({ _id: true })

export const UpdateUserSchema = UserSchema.partial().omit({
  _id: true,
  email: true,
  createdAt: true,
})

export interface ICreateUserInput extends z.input<typeof UserCollectionSchema> {}
export interface IUser extends z.infer<typeof UserSchema> {}
export interface IUserCollection extends z.infer<typeof UserCollectionSchema> {}
export interface IUpdateUserInput extends z.infer<typeof UpdateUserSchema> {}
