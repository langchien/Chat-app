import z from 'node_modules/zod/v4/classic/external.cjs'
import { OtpRequest } from './otp-request.schema'

export const IOTPRequestCollection = OtpRequest.partial({ _id: true })

export interface IOtpRequest extends z.infer<typeof OtpRequest> {}
export interface IOtpRequestCollection extends z.infer<typeof IOTPRequestCollection> {}
