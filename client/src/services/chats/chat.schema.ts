import { BaseCollection, createObjectId, createString } from '@/lib/schema.common'
import z from 'zod'

export const Chat = BaseCollection.extend({
  participants: z.array(
    z.object({
      userId: createObjectId('userId'),
      nickName: createString('nickName', 50).optional(),
    }),
  ),
  lastMessage: z.string().default('Ấn để bắt đầu cuộc trò chuyện'),
})
