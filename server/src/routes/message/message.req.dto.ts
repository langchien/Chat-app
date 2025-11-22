import { createStringIdSchema } from '@/lib/schema.common'
import z from 'zod'
import { MessageSchema } from './message.schema'

export const MessageIdParamSchema = z.object({
  messageId: createStringIdSchema('Message ID'),
})
export const CreateMessageBodySchema = MessageSchema.omit({
  _id: true,
  createdAt: true,
  updatedAt: true,
  senderId: true,
})

export const UpdateMessageBodySchema = CreateMessageBodySchema.partial().omit({
  chatId: true,
})

export interface IMessageIdParamDto extends z.infer<typeof MessageIdParamSchema> {}
export interface ICreateMessageBodyDto extends z.infer<typeof CreateMessageBodySchema> {}
export interface IUpdateMessageBodyDto extends z.infer<typeof UpdateMessageBodySchema> {}
