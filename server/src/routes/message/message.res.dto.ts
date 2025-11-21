import { PaginateCursorResSchema } from '@/lib/paginate-cusor.ctrl'
import z from 'zod'
import { MediaSchema } from '../media/media.schema'
import { MessageSchema } from './message.schema'

export const MessagePaginateCursorResSchema = PaginateCursorResSchema.extend({
  data: z.array(MessageSchema),
})

export interface IMessagePaginateCursorRes extends z.infer<typeof MessagePaginateCursorResSchema> {}

export const MessageResSchema = MessageSchema.extend({
  media: MediaSchema.omit({
    createdAt: true,
    updatedAt: true,
  }).optional(),
}).omit({
  mediaId: true,
})

export interface IMessageRes extends z.infer<typeof MessageResSchema> {}
