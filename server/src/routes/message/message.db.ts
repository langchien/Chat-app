import { createStringId } from '@/lib/schema.common'
import z from 'zod'
import { Message } from './message.schema'

const CreateMessageInput = Message.pick({
  chatId: true,
  senderId: true,
  content: true,
}).extend({
  mediaIds: z.array(createStringId('Media ID')).optional(),
})

export const UpdateMessageInput = CreateMessageInput.pick({
  content: true,
  mediaIds: true,
}).partial()

export interface IMessage extends z.infer<typeof Message> {}
export interface IUpdateMessageInput extends z.input<typeof UpdateMessageInput> {}
export interface ICreateMessageInput extends z.input<typeof CreateMessageInput> {}
