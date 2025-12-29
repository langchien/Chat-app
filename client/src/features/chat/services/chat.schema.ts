import { BaseCollection, createStringId } from '@/lib/schema.common'
import z from 'zod'

export const ChatType = {
  DIRECT: 'direct',
  GROUP: 'group',
} as const

export const Participant = z.object({
  id: createStringId(),
  userId: createStringId('UserId'),
  chatId: createStringId('ChatId'),
  joinedAt: z.date(),
  nickname: z.string().optional(),
  deletedAt: z.date().nullish(),
})

export const GroupInfo = z.object({
  name: z.string(),
  createdBy: createStringId('UserId'),
})

export const LastMessageInfo = z.object({
  content: z.string(),
  senderId: createStringId('UserId'),
  createdAt: z.date(),
})

export const Chat = BaseCollection.extend({
  type: z.enum([ChatType.DIRECT, ChatType.GROUP]),
  participants: z.array(Participant),
  groupInfo: GroupInfo.optional(),
  lastMessage: LastMessageInfo.optional(),
})
