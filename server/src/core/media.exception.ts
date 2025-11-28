import { errors as formidableErrors } from 'formidable'

// todo: Thư viện formidable có thể chưa được cập nhật đầy đủ các mã lỗi. Cần kiểm tra và bổ sung khi cần thiết.
export const UPLOAD_ERROR_CODE = {
  ABORTED: formidableErrors.aborted, // 1002
  BIGGER_THAN_MAX_FILE_SIZE: formidableErrors.biggerThanMaxFileSize, // 1016
  BIGGER_THAN_TOTAL_MAX_FILE_SIZE: 1009, // formidableErrors.biggerThanTotalMaxFileSize, // 1009
  CANNOT_CREATE_DIR: 1018, // formidableErrors.cannotCreateDir, // 1018
  FILENAME_NOT_STRING: formidableErrors.filenameNotString, // 1005
  MALFORMED_MULTIPART: formidableErrors.malformedMultipart, // 1012
  MAX_FIELDS_EXCEEDED: formidableErrors.maxFieldsExceeded, // 1007
  MAX_FIELDS_SIZE_EXCEEDED: formidableErrors.maxFieldsSizeExceeded, // 1006
  MAX_FILES_EXCEEDED: 1015, // formidableErrors.maxFilesExceeded, // 1015
  MISSING_CONTENT_TYPE: formidableErrors.missingContentType, // 1011
  MISSING_MULTIPART_BOUNDARY: formidableErrors.missingMultipartBoundary, // 1013
  MISSING_PLUGIN: formidableErrors.missingPlugin, // 1000
  NO_EMPTY_FILES: formidableErrors.noEmptyFiles, // 1010
  NO_PARSER: formidableErrors.noParser, // 1003
  PLUGIN_FAILED: 1017, // formidableErrors.pluginFailed, // 1017
  PLUGIN_FUNCTION: formidableErrors.pluginFunction, // 1001
  SMALLER_THAN_MIN_FILE_SIZE: formidableErrors.smallerThanMinFileSize, // 1008
  UNINITIALIZED_PARSER: formidableErrors.uninitializedParser, // 1004
  UNKNOWN_TRANSFER_ENCODING: formidableErrors.unknownTransferEncoding, // 1014
} as const

export const UPLOAD_ERROR_MESSAGE: Record<number, string> = {
  [UPLOAD_ERROR_CODE.ABORTED]: 'Tải lên đã bị hủy.',
  [UPLOAD_ERROR_CODE.BIGGER_THAN_MAX_FILE_SIZE]: 'Kích thước tệp vượt quá giới hạn cho phép.',
  [UPLOAD_ERROR_CODE.BIGGER_THAN_TOTAL_MAX_FILE_SIZE]:
    'Tổng kích thước các tệp vượt quá giới hạn cho phép.',
  [UPLOAD_ERROR_CODE.CANNOT_CREATE_DIR]: 'Không thể tạo thư mục để lưu tệp.',
  [UPLOAD_ERROR_CODE.FILENAME_NOT_STRING]: 'Tên tệp không hợp lệ.',
  [UPLOAD_ERROR_CODE.MALFORMED_MULTIPART]: 'Dữ liệu multipart bị lỗi.',
  [UPLOAD_ERROR_CODE.MAX_FIELDS_EXCEEDED]: 'Vượt quá số lượng trường tối đa.',
  [UPLOAD_ERROR_CODE.MAX_FIELDS_SIZE_EXCEEDED]: 'Vượt quá kích thước tối đa của các trường.',
  [UPLOAD_ERROR_CODE.MAX_FILES_EXCEEDED]: 'Vượt quá số lượng tệp tối đa.',
  [UPLOAD_ERROR_CODE.MISSING_CONTENT_TYPE]: "Thiếu header 'Content-Type'.",
  [UPLOAD_ERROR_CODE.MISSING_MULTIPART_BOUNDARY]: 'Thiếu ranh giới multipart.',
  [UPLOAD_ERROR_CODE.MISSING_PLUGIN]: 'Thiếu plugin cần thiết.',
  [UPLOAD_ERROR_CODE.NO_EMPTY_FILES]: 'Không cho phép tệp rỗng.',
  [UPLOAD_ERROR_CODE.NO_PARSER]: 'Không tìm thấy bộ phân tích cú pháp.',
  [UPLOAD_ERROR_CODE.PLUGIN_FAILED]: 'Plugin đã gặp lỗi.',
  [UPLOAD_ERROR_CODE.PLUGIN_FUNCTION]: 'Lỗi chức năng plugin.',
  [UPLOAD_ERROR_CODE.SMALLER_THAN_MIN_FILE_SIZE]: 'Kích thước tệp nhỏ hơn mức tối thiểu cho phép.',
  [UPLOAD_ERROR_CODE.UNINITIALIZED_PARSER]: 'Bộ phân tích cú pháp chưa được khởi tạo.',
  [UPLOAD_ERROR_CODE.UNKNOWN_TRANSFER_ENCODING]: "Không rõ 'Transfer-Encoding'.",
}

export interface IMediaExceptionPayload {
  code: number
  httpCode: number
  message: string
}

interface IUploadExceptionOptions {
  maxFiles?: number
  maxFileSizeInMB?: number
  maxTotalFileSizeInMB?: number
}

export class UploadException extends Error {
  code: number
  httpCode: number
  constructor(payload: IMediaExceptionPayload, options: IUploadExceptionOptions = {}) {
    const { maxFiles, maxFileSizeInMB, maxTotalFileSizeInMB } = options

    let message = UPLOAD_ERROR_MESSAGE[payload.code] || 'Lỗi không xác định khi tải file lên'

    switch (payload.code) {
      case UPLOAD_ERROR_CODE.MAX_FILES_EXCEEDED:
        if (maxFiles !== undefined) {
          message = `Tối đa chỉ được tải lên ${maxFiles} file`
        }
        break
      case UPLOAD_ERROR_CODE.BIGGER_THAN_MAX_FILE_SIZE:
        if (maxFileSizeInMB !== undefined) {
          message = `Mỗi file không được vượt quá ${maxFileSizeInMB} MB`
        }
        break
      case UPLOAD_ERROR_CODE.BIGGER_THAN_TOTAL_MAX_FILE_SIZE:
        if (maxTotalFileSizeInMB !== undefined) {
          message = `Tổng kích thước tất cả các file không được vượt quá ${maxTotalFileSizeInMB} MB`
        }
        break
    }

    super(message)
    this.name = 'UploadException'
    this.code = payload.code
    this.httpCode = payload.httpCode
  }
}
