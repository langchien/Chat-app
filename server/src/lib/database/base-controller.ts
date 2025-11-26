import { NotFoundException } from '@/core/exceptions'
import { isRecordNotFoundError } from './prisma-exception'

export class BaseController {
  protected handleNotFoundError(error: any, message?: string) {
    if (isRecordNotFoundError(error)) throw new NotFoundException(message)
    throw error
  }
}
