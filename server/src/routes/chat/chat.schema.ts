import { BaseCollectionSchema, createObjectIdSchema, createStringSchema } from '@/lib/schema.common'
import z from 'zod'

export const ChatSchemma = BaseCollectionSchema.extend({
  participants: z.array(
    z.object({
      userId: createObjectIdSchema('userId'),
      nickName: createStringSchema('nickName', 50).optional(),
    }),
  ),
  lastMessage: z.string().default('Ấn để bắt đầu cuộc trò chuyện'),
})

export const ChatCollSchema = ChatSchemma.partial({ _id: true })
export const UpdateChatSchema = ChatSchemma.partial().omit({
  _id: true,
  createdAt: true,
})

export interface IChat extends z.infer<typeof ChatSchemma> {}
export interface IChatCollection extends z.infer<typeof ChatCollSchema> {}
export interface ICreateChatInp extends z.input<typeof ChatCollSchema> {}
export interface IUpdateChatInp extends z.input<typeof UpdateChatSchema> {}
