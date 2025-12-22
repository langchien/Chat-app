import { createStringId } from '@/lib/schema.common'
import z from 'zod'
import { Message } from './message.schema'

export const MessageIdParamDto = z.object({
  messageId: createStringId('Message ID'),
})
export const CreateMessageBodyDto = Message.pick({
  content: true,
  chatId: true,
}).extend({
  mediaIds: z.array(createStringId('Media ID')).optional(),
})

export const UpdateMessageBody = CreateMessageBodyDto.partial().omit({
  chatId: true,
})

export interface IMessageIdParamDto extends z.infer<typeof MessageIdParamDto> {}
export interface ICreateMessageBodyDto extends z.infer<typeof CreateMessageBodyDto> {}
export interface IUpdateMessageBodyDto extends z.infer<typeof UpdateMessageBody> {}
