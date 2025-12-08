import { BaseService } from '@/lib/database'
import { ICreateOtpRequestInput } from './otp-request.db'
import { OtpType } from './otp-request.schema'

export class OtpService extends BaseService {
  upsert(data: ICreateOtpRequestInput) {
    return this.prismaService.otpRequest.upsert({
      where: {
        email_type: {
          email: data.email,
          type: data.type,
        },
      },
      create: data,
      update: data,
    })
  }

  findOneAndDelete({ email, type, otp }: { email: string; type: OtpType; otp: string }) {
    return this.prismaService.otpRequest.delete({
      where: {
        email_type: {
          email,
          type,
        },
        otp,
      },
    })
  }

  findByEmailAndType(email: string, type: OtpType) {
    return this.prismaService.otpRequest.findUnique({
      where: {
        email_type: {
          email,
          type,
        },
      },
    })
  }

  async create(data: any) {}
}

export const otpService = new OtpService()
