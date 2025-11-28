import { AppException, BadRequestException, UnprocessableEntityException } from '@/core/exceptions'
import { UploadException } from '@/core/media.exception'
import { HttpStatusCode, HttpStatusMessage } from '@/core/status-code'
import { logger } from '@/lib/logger.service'
import { NextFunction, Request, Response } from 'express'

export function handlerExceptionDefault(err: any, req: Request, res: Response, next: NextFunction) {
  if (err instanceof UnprocessableEntityException || err instanceof BadRequestException)
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
      errorInfor: err.errorInfor,
    })
  if (err instanceof AppException)
    return res.status(err.statusCode).json({
      statusCode: err.statusCode,
      message: err.message,
    })
  if (err instanceof UploadException)
    return res.status(err.httpCode).json({
      statusCode: err.httpCode,
      message: err.message,
    })
  logger.error('Đã xảy ra lỗi không mong muốn:', err)
  res.status(HttpStatusCode.InternalServerError).json({
    statusCode: HttpStatusCode.InternalServerError,
    message: HttpStatusMessage[HttpStatusCode.InternalServerError],
  })
}
