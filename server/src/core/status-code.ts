export enum HttpStatusCode {
  Ok = 200,
  Created = 201,
  NoContent = 204,
  BadRequest = 400,
  Unauthorized = 401,
  Fobidden = 403,
  Notfound = 404,
  Conflict = 409,
  PayloadTooLarge = 413,
  TooManyRequest = 429,
  InternalServerError = 500,
  UnprocessableEntity = 422,
}

export const HttpStatusMessage: Record<HttpStatusCode, string> = {
  [HttpStatusCode.Ok]: 'Thành công',
  [HttpStatusCode.Created]: 'Đã tạo',
  [HttpStatusCode.BadRequest]: 'Yêu cầu không hợp lệ',
  [HttpStatusCode.NoContent]: 'Không có nội dung',
  [HttpStatusCode.Unauthorized]: 'Chưa xác thực',
  [HttpStatusCode.Fobidden]: 'Không có quyền truy cập',
  [HttpStatusCode.Notfound]: 'Không tìm thấy',
  [HttpStatusCode.Conflict]: 'Xung đột dữ liệu',
  [HttpStatusCode.TooManyRequest]: 'Quá nhiều yêu cầu, vui lòng thử lại sau',
  [HttpStatusCode.PayloadTooLarge]: 'Dữ liệu gửi lên quá lớn hoặc vượt quá số lượng cho phép',
  [HttpStatusCode.InternalServerError]: 'Lỗi máy chủ nội bộ',
  [HttpStatusCode.UnprocessableEntity]: 'Dữ liệu từ body không hợp lệ',
}
