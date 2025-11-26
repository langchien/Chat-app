import { BaseCollection, createString, createStringId } from '@/lib/schema.common'

export const Message = BaseCollection.extend({
  senderId: createStringId('senderId'),
  chatId: createStringId('chatId'),
  content: createString('Nội dung tin nhắn', 1000),
})
