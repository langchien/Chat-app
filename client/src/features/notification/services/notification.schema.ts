import { z } from 'zod'

export const NotificationTypeSchema = z.enum([
  'FRIEND_REQUEST',
  'FRIEND_ACCEPTED',

  'ADDED_TO_GROUP',
])

export type NotificationType = z.infer<typeof NotificationTypeSchema>

export const NotificationSchema = z.object({
  id: z.string(),
  recipientId: z.string(),
  senderId: z.string().nullable().optional(),
  type: NotificationTypeSchema,
  content: z.string(),
  link: z.string().nullable().optional(),
  isRead: z.boolean(),
  createdAt: z.string(), // Frontend receives string dates
  sender: z
    .object({
      id: z.string(),
      displayName: z.string(),
      avatarUrl: z.string(),
    })
    .optional(),
})

export type Notification = z.infer<typeof NotificationSchema>
