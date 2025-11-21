import { HttpStatusCode, HttpStatusMessage } from './status-code'

export interface IValidateErrorDetail {
  message: string
  path: PropertyKey[]
}

export interface IValidateErrorInfor {
  location: 'params' | 'query' | 'body'
  errors: IValidateErrorDetail[]
}

/**
 * @param message - Tin nhắn sẽ trả về cho client khi xảy ra lỗi.
 * @param statusCode - Mã trạng thái HTTP (mặc định là 500).
 * @description Lớp này đóng vai trò là cơ sở cho mọi ngoại lệ tùy chỉnh trong ứng dụng.
 */
export class AppException extends Error {
  statusCode: number
  constructor(statusCode: HttpStatusCode = HttpStatusCode.InternalServerError, message?: string) {
    super(message ?? HttpStatusMessage[statusCode])
    this.statusCode = statusCode
  }
}

export class BadRequestException extends AppException {
  errorInfor?: IValidateErrorInfor
  constructor(
    errorInfor?: IValidateErrorInfor,
    message: string = HttpStatusMessage[HttpStatusCode.BadRequest],
  ) {
    super(HttpStatusCode.BadRequest, message)
    this.errorInfor = errorInfor
  }
}

export class UnauthorizedException extends AppException {
  constructor(message?: string) {
    super(HttpStatusCode.Unauthorized, message)
  }
}

export class ForbiddenException extends AppException {
  constructor(message?: string) {
    super(HttpStatusCode.Fobidden, message)
  }
}

export class NotFoundException extends AppException {
  constructor(message?: string) {
    super(HttpStatusCode.Notfound, message)
  }
}
export class ConflictException extends AppException {
  constructor(message?: string) {
    super(HttpStatusCode.Conflict, message)
  }
}

export class TooManyRequestsException extends AppException {
  constructor(message?: string) {
    super(HttpStatusCode.TooManyRequest, message)
  }
}

export class PayloadTooLargeException extends AppException {
  constructor(message?: string) {
    super(HttpStatusCode.PayloadTooLarge, message)
  }
}

export class InternalServerErrorException extends AppException {
  constructor(message?: string) {
    super(HttpStatusCode.InternalServerError, message)
  }
}

export class UnprocessableEntityException extends AppException {
  errorInfor: IValidateErrorInfor
  constructor(validateError: IValidateErrorDetail[], message?: string) {
    super(HttpStatusCode.UnprocessableEntity, message)
    this.errorInfor = { location: 'body', errors: validateError }
  }
}
