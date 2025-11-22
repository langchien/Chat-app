import { createStringIdSchema } from '@/lib/schema.common'
import z from 'zod'
import { ChatSchemma } from './chat.schema'

export const ChatIdParamSchema = z.object({
  chatId: createStringIdSchema('chatId'),
})

export interface IChatIdParamDto extends z.infer<typeof ChatIdParamSchema> {}

export const CreateChatReqSchema = ChatSchemma.pick({
  lastMessage: true,
}).extend({
  receiverIds: z.array(createStringIdSchema('receiverId')).min(1),
})
export interface ICreateChatReqDto extends z.infer<typeof CreateChatReqSchema> {}

export const UpdateChatReqSchema = ChatSchemma.pick({
  lastMessage: true,
})
export interface IUpdateChatReqDto extends z.infer<typeof UpdateChatReqSchema> {}
