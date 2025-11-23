import { BaseCollection, createObjectId, createString } from '@/lib/schema.common'
import z from 'zod'

enum MessageType {
  Text = 'text',
  Media = 'media',
}

export const Message = BaseCollection.extend({
  senderId: createObjectId('senderId'),
  chatId: createObjectId('chatId'),
  type: z.enum(MessageType).default(MessageType.Text),
  text: createString('Nội dung tin nhắn', 1000),
  mediaId: createObjectId('Media ID').optional(),
})
