import { BaseCollectionSchema, createObjectIdSchema, createStringSchema } from '@/lib/schema.common'
import z from 'zod'

enum MessageType {
  Text = 'text',
  Media = 'media',
}

export const MessageSchema = BaseCollectionSchema.extend({
  senderId: createObjectIdSchema('senderId'),
  chatId: createObjectIdSchema('chatId'),
  type: z.enum(MessageType).default(MessageType.Text),
  text: createStringSchema('Nội dung tin nhắn', 1000),
  mediaId: createObjectIdSchema('Media ID').optional(),
})
export const MessageCollectionSchema = MessageSchema.partial({ _id: true })

export const UpdateMessageSchema = MessageSchema.partial().omit({
  _id: true,
  createdAt: true,
  senderId: true,
  chatId: true,
})

export interface IMessage extends z.infer<typeof MessageSchema> {}
export interface IMessageCollection extends z.infer<typeof MessageCollectionSchema> {}
export interface ICreateMessageInput extends z.input<typeof MessageCollectionSchema> {}
export interface IUpdateMessageInput extends z.input<typeof UpdateMessageSchema> {}
