import {
  BaseCollection,
  createEmail,
  createName,
  createString,
  Username,
} from '@/lib/schema.common'
import z from 'zod'

export const User = BaseCollection.extend({
  username: Username,
  email: createEmail(),
  displayName: createName('Tên hiển thị', 100),
  hashedPassword: z.string(),
  avatarUrl: z.url().nullish(),
  bio: createString('Bio', 300).nullish(),
  phone: createString('Sổ điện thoại', 15).nullish(),
})