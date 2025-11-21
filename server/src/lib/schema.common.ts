import { ObjectId } from 'mongodb'
import z from 'zod'

export const createStringIdSchema = (fieldName: string = 'id') =>
  z.string().refine((val) => ObjectId.isValid(val), {
    // : input must be a 24 character hex string, 12 byte Uint8Array, or an integer
    message: `${fieldName} phải phù hợp với ObjectId của mongodb (có 24 ký tự hex hoặc 12 byte Uint8Array hoặc một số nguyên)`,
  })

export const createObjectIdSchema = (fieldName: string = 'id') =>
  z.any().transform((val, ctx) => {
    if (!ObjectId.isValid(val)) {
      ctx.addIssue({
        code: 'custom',
        message: `${fieldName} không phải là một ObjectId hợp lệ`,
      })
      return z.NEVER
    }
    return new ObjectId(val)
  })

export const PasswordSchema = z.string('Mật khẩu không được để trống').refine(
  (val) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    return regex.test(val)
  },
  {
    message:
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm tối thiểu 1 ký tự đặc biệt, tối thiểu 1 số, 1 chữ viết hoa và 1 chữ viết thường',
  },
)

export const createEmailSchema = (fieldName: string = 'email') =>
  z.email({ message: `${fieldName} phải là một email` })

export const createNameSchema = (fieldName: string, length: number = 500) =>
  z
    .string(`${fieldName} là phải là chuỗi`)
    .trim()
    .toLowerCase()
    .min(1, { message: `${fieldName} không được để trống` })
    .max(length, { message: `${fieldName} không được vượt quá ${length} ký tự` })

export const createStringSchema = (fieldName: string, length: number = 500) =>
  z
    .string(`${fieldName} là phải là chuỗi`)
    .trim()
    .min(1, { message: `${fieldName} không được để trống` })
    .max(length, { message: `${fieldName} không được vượt quá ${length} ký tự` })

export const OtpSchema = z.string('OTP phải là chuỗi').length(6, {
  message: 'OTP phải có độ dài 6 ký tự',
})

export const BaseCollectionSchema = z.object({
  _id: createObjectIdSchema('id'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})
