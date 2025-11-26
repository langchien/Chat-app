import { Prisma } from '@prisma/client'
export const isPrismaQueryError = (
  error: unknown,
  code: string,
): error is Prisma.PrismaClientKnownRequestError => {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === code
}

/**
 * @code P2002: Lỗi trùng lặp dữ liệu trong cơ sở dữ liệu.
 * @description Lỗi này xảy ra khi bạn cố gắng chèn một bản ghi mà đã tồn tại trong cơ sở dữ liệu với cùng một giá trị cho một trường có ràng buộc duy nhất.
 * @param error Lỗi cần kiểm tra.
 * @returns True nếu lỗi là lỗi trùng lặp dữ liệu (`P2002`).
 */
export const isUniqueConstraintError = (error: unknown) => isPrismaQueryError(error, 'P2002')

/**
 * @code P2025: Lỗi không tìm thấy bản ghi trong cơ sở dữ liệu.
 * @description Lỗi này xảy ra khi bạn cố gắng truy xuất một bản ghi không tồn tại trong cơ sở dữ liệu.
 * @param error Lỗi cần kiểm tra.
 * @returns True nếu lỗi là lỗi không tìm thấy bản ghi (`P2025`).
 */
export const isRecordNotFoundError = (error: unknown) => isPrismaQueryError(error, 'P2025')

/**
 * @code P2001: Lỗi yêu cầu bản ghi trong cơ sở dữ liệu.
 * @description Lỗi này xảy ra khi bạn cố gắng truy xuất một bản ghi mà không có khóa chính hoặc khóa ngoại trong cơ sở dữ liệu.
 * @param error Lỗi cần kiểm tra.
 * @returns True nếu lỗi là lỗi yêu cầu bản ghi (`P2001`).
 */
export const isRecordRequiredError = (error: unknown) => isPrismaQueryError(error, 'P2001')

/**
 * @code P2003: Lỗi ràng buộc khóa ngoại.
 * @description Lỗi này xảy ra khi bạn cố gắng xóa một bản ghi mà có các bản ghi liên quan trong các bảng khác.
 * @param error Lỗi cần kiểm tra.
 * @returns True nếu lỗi là lỗi ràng buộc khóa ngoại (`P2003`).
 */
export const isForeignKeyConstraintError = (error: unknown) => isPrismaQueryError(error, 'P2003')
