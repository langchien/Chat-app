import { BaseCollection, createString } from '@/lib/schema.common'
import z from 'zod'

export const FriendRequest = BaseCollection.extend({
  message: createString('Tin nhắn', 300).default('Kết bạn với mình nhé!'),
  status: z.enum(['pending', 'accepted', 'rejected']).default('pending'),
})
