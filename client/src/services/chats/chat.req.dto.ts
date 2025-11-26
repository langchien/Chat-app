import { createStringId } from '@/lib/schema.common'
import z from 'zod'
import { Chat } from './chat.schema'

export const ChatIdParam = z.object({
  chatId: createStringId('chatId'),
})

export const CreateChatReq = Chat.pick({
  lastMessage: true,
  groupInfo: true,
  type: true,
}).extend({
  receiverIds: z.array(createStringId('receiverId')).min(1),
})

export const UpdateChatReq = Chat.pick({
  groupInfo: true,
  lastMessage: true,
}).partial()

export interface IChatIdParamDto extends z.infer<typeof ChatIdParam> {}
export interface ICreateChatReqDto extends z.infer<typeof CreateChatReq> {}
export interface IUpdateChatReqDto extends z.infer<typeof UpdateChatReq> {}