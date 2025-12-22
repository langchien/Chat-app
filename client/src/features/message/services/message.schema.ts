import { BaseCollection, createStringId } from '@/lib/schema.common'
import z from 'zod'

export const Message = BaseCollection.extend({
  senderId: createStringId('senderId'),
  chatId: createStringId('chatId'),
  content: z.string().max(2000).describe('Nội dung tin nhắn'),
})
