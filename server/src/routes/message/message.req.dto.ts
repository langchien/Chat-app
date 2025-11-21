import { createStringIdSchema } from '@/lib/schema.common'
import z from 'zod'

export const MessageIdParamSchema = z.object({
  messageId: createStringIdSchema('Message ID'),
})

export interface IMessageIdParam extends z.infer<typeof MessageIdParamSchema> {}
