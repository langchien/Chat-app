import { BadRequestException } from '@/core/exceptions'
import z from 'zod'
import { BaseController } from './database'
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

export interface QueryString {
  [key: string]: undefined | string | QueryString | (string | QueryString)[]
}

export class PaginateCursorCtrl extends BaseController {
  protected parsePaginationQuery(query: QueryString): IPaginateCursorQuery {
    const result = PaginateCursorQuery.safeParse(query)
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
