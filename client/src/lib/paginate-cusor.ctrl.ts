import z from 'zod'
import { createStringId } from './schema.common'

export const PaginateCursorQuery = z.object({
  cursor: createStringId('cursor').optional(),
  limit: z.coerce.number().positive().default(20),
})
export interface IPaginateCursorQuery extends z.infer<typeof PaginateCursorQuery> {}

export const PaginateCursorResDto = z.object({
  hasMore: z.boolean(),
  nextCursor: createStringId('nextCursor').nullable(),
})
