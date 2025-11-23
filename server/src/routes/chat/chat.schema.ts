import { BaseCollection, createObjectId, createString } from '@/lib/schema.common'
import z from 'zod'

export const Chat = BaseCollection.extend({
  participants: z.array(
    z.object({
      userId: createObjectId('userId'),
      nickName: createString('nickName', 50).optional(),
    }),
  ),
  lastMessage: z.string().default('Ấn để bắt đầu cuộc trò chuyện'),
})

export const ChatCollection = Chat.partial({ _id: true })
export const UpdateChat = Chat.partial().omit({
  _id: true,
  createdAt: true,
})

export interface IChat extends z.infer<typeof Chat> {}
export interface IChatCollection extends z.infer<typeof ChatCollection> {}
export interface ICreateChatInp extends z.input<typeof ChatCollection> {}
export interface IUpdateChatInp extends z.input<typeof UpdateChat> {}
