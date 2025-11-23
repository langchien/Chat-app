import {
  BaseCollection,
  createEmail,
  createName,
  createObjectId,
  createString,
  Username,
} from '@/lib/schema.common'
import z from 'zod'

export const User = BaseCollection.extend({
  username: Username,
  email: createEmail(),
  displayName: createName('Tên hiển thị', 100),
  hashedPassword: z.string(),
  avatarId: createObjectId('avatarId').optional(),
  avatarUrl: z.url().optional(),
  bio: createString('Bio', 300).optional(),
  phone: createString('Sổ điện thoại', 15).optional(),
  friends: z.array(createObjectId('FriendId')).default([]),
})
