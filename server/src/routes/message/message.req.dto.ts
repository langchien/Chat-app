import { createStringId } from '@/lib/schema.common'
import z from 'zod'
import { Message } from './message.schema'

export const MessageIdParamDto = z.object({
  messageId: createStringId('Message ID'),
})
export const CreateMessageBodyDto = Message.pick({
  text: true,
  type: true,
}).extend({
  chatId: createStringId('Chat ID'),
  senderId: createStringId('Sender ID'),
  mediaId: createStringId('Media ID').optional(),
})

export const UpdateMessageBody = CreateMessageBodyDto.partial().omit({
  chatId: true,
})

export interface IMessageIdParamDto extends z.infer<typeof MessageIdParamDto> {}
export interface ICreateMessageBodyDto extends z.infer<typeof CreateMessageBodyDto> {}
export interface IUpdateMessageBodyDto extends z.infer<typeof UpdateMessageBody> {}
