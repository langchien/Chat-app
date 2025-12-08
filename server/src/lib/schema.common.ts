import { ObjectId } from 'bson'
import z from 'zod'

export const createStringId = (fieldName: string = 'id') =>
  z.string().refine((val) => ObjectId.isValid(val), {
    // : input must be a 24 character hex string, 12 byte Uint8Array, or an integer
    message: `${fieldName} phải phù hợp với ObjectId của mongodb (có 24 ký tự hex hoặc 12 byte Uint8Array hoặc một số nguyên)`,
  })

export const Password = z.string('Mật khẩu không được để trống').refine(
  (val) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/
    return regex.test(val)
  },
  {
    message:
      'Mật khẩu phải có ít nhất 8 ký tự, bao gồm tối thiểu 1 ký tự đặc biệt, tối thiểu 1 số, 1 chữ viết hoa và 1 chữ viết thường',
  },
)

export const createEmail = (fieldName: string = 'email') =>
  z.email({ message: `${fieldName} phải là một email` })

export const createName = (fieldName: string, length: number = 500) =>
  z
    .string(`${fieldName} là phải là chuỗi`)
    .trim()
    .toLowerCase()
    .min(1, { message: `${fieldName} không được để trống` })
    .max(length, { message: `${fieldName} không được vượt quá ${length} ký tự` })

export const createString = (fieldName: string, length: number = 500) =>
  z
    .string(`${fieldName} là phải là chuỗi`)
    .trim()
    .max(length, { message: `${fieldName} không được vượt quá ${length} ký tự` })

export const Otp = z.string('OTP phải là chuỗi').length(6, {
  message: 'OTP phải có độ dài 6 ký tự',
})

export const BaseCollection = z.object({
  id: createStringId('id'),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
})

export const Username = z
  .string()
  .min(3, 'Username phải có ít nhất 3 ký tự')
  .max(100, 'Username không được vượt quá 100 ký tự')
  .regex(/^[a-zA-Z0-9_-]+$/, 'Username chỉ được chứa chữ cái, số và gạch dưới')

export const IdParamDto = z.object({
  id: createStringId('id'),
})

export interface IIdParamDto extends z.infer<typeof IdParamDto> {}
