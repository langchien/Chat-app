import { createStringId } from '@/lib/schema.common'
import z from 'zod'
import { Chat } from './chat.schema'

export const CreateChatInp = Chat.pick({
  type: true,
  groupInfo: true,
  lastMessage: true,
}).extend({
  receiverIds: z.array(createStringId('ReceiverIds')),
})

export const UpdateChatInp = Chat.pick({
  groupInfo: true,
  lastMessage: true,
}).partial()

export interface IChat extends z.infer<typeof Chat> {}
export interface ICreateChatInp extends z.input<typeof CreateChatInp> {}
export interface IUpdateChatInp extends z.input<typeof UpdateChatInp> {}
