import { BadRequestException, UnprocessableEntityException } from '@/core/exceptions'
import { RequestHandler } from 'express'
import { ZodObject } from 'zod'

/**
 * Middleware để validate request data sử dụng Zod schema.
 * @param schema - Zod schema đã khai báo dữ liệu mong muốn nhận được.
 * @param typeValidation - Loại dữ liệu cần validate: 'body', 'params', hoặc 'query'. Mặc định là 'body'.
 * @returns Middleware function để sử dụng trong Express route handlers.
 */
export const zodValidate: (
  schema: ZodObject,
  typeValidation?: 'body' | 'params' | 'query',
) => RequestHandler = (schema: ZodObject, typeValidation: 'body' | 'params' | 'query' = 'body') => {
  return (req, res, next) => {
    const result = schema.safeParse(req[typeValidation])
    if (result.error) {
      const errors = result.error.issues.map((issue) => ({
        message: issue.message,
        path: issue.path,
      }))
      if (typeValidation === 'body') throw new UnprocessableEntityException(errors)
      else
        throw new BadRequestException({
          location: typeValidation,
          errors: errors,
        })
    } else {
      if (typeValidation === 'body') req.body = result.data
      // param, query nó là kiểu string, string[],... nên ko gán lại cả object được, chỉ gán từng giá trị riêng lẻ, như thế không hiệu quả
      next()
    }
  }
}
