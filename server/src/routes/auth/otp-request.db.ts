import z from 'node_modules/zod/v4/classic/external.cjs'
import { OtpRequest } from './otp-request.schema'

const CreateOtpRequestInput = OtpRequest.omit({ id: true })

const UpdateOtpRequestInput = OtpRequest.pick({
  exp: true,
  otp: true,
  iat: true,
}).partial()

export interface IOtpRequest extends z.infer<typeof OtpRequest> {}
export interface ICreateOtpRequestInput extends z.input<typeof CreateOtpRequestInput> {}
export interface IUpdateOtpRequestInput extends z.input<typeof UpdateOtpRequestInput> {}
