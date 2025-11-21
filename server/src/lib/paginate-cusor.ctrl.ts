import { BadRequestException } from '@/core/exceptions'
import z from 'zod'
import { createStringIdSchema } from './schema.common'

export const PaginateCursorQuerySchema = z.object({
  cursor: createStringIdSchema('cursor').optional(),
  limit: z.coerce.number().positive().default(20),
})
export interface IPaginateCursorQuery extends z.infer<typeof PaginateCursorQuerySchema> {}

export const PaginateCursorResSchema = z.object({
  hasMore: z.boolean(),
})

export interface QueryString {
  [key: string]: undefined | string | QueryString | (string | QueryString)[]
}

export class PaginateCursorCtrl {
  protected parsePaginationQuery(query: QueryString): IPaginateCursorQuery {
    const result = PaginateCursorQuerySchema.safeParse(query)
    if (result.success) return result.data
    throw new BadRequestException({
      location: 'query',
      errors: result.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path,
      })),
    })
  }
}
