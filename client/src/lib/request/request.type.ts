export const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  UNPROCESSABLE_ENTITY: 422,
} as const

export enum REQ_LOCATION {
  PARAMS = 'params',
  QUERY = 'query',
  BODY = 'body',
}

export enum REQ_METHOD {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export interface ResponseErrorPayload {
  message: string
  statusCode: number
}
export interface ErrorDetail {
  message: string
  path: PropertyKey[]
}

export interface ValidationErrorPayload extends ResponseErrorPayload {
  errorInfor: {
    errors: ErrorDetail[]
    location: REQ_LOCATION
  }
}

export class AppException extends Error {
  statusCode: number
  constructor(payload: ResponseErrorPayload) {
    super(payload.message)
    this.statusCode = payload.statusCode
  }
}

export class UnprocessableEntityException extends AppException {
  errorInfor: {
    errors: ErrorDetail[]
    location: REQ_LOCATION
  }
  constructor(payload: ValidationErrorPayload) {
    super({ message: payload.message, statusCode: HTTP_STATUS_CODE.UNPROCESSABLE_ENTITY })
    this.errorInfor = payload.errorInfor
  }
}

export interface CustomRequestInit extends Omit<RequestInit, 'body'> {
  baseUrl?: string
  body?: Record<string, any>
}
