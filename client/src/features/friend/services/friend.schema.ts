import { BaseCollection, createString, createStringId } from '@/lib/schema.common'
import z from 'zod'

export const FriendRequestStatus = {
  pending: 'pending',
  accepted: 'accepted',
  rejected: 'rejected',
} as const

export type FriendRequestStatus = (typeof FriendRequestStatus)[keyof typeof FriendRequestStatus]

export const FriendRequest = BaseCollection.extend({
  message: createString('Tin nhắn', 300),
  status: z.enum(FriendRequestStatus).default(FriendRequestStatus.pending),
  fromId: createString('ID người gửi'),
  toId: createString('ID người nhận'),
})

export const Friend = z.object({
  id: createStringId(),
  userId: createString('ID người dùng'),
  friendId: createString('ID bạn bè'),
  createdAt: z.date(),
})
