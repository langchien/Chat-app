import { maillerService } from '@/lib/mailler.service'
import { generateOtpEmailTemplate, OTP_MESSAGE } from '@/routes/auth/html.template'
import { OtpType } from './otp-request.schema'

/**
 * @description Dịch vụ gửi email liên quan đến xác thực
 * @description Áp dụng Singleton pattern
 */
class AuthMaillerService {
  // Singleton instance
  private static instance: AuthMaillerService
  private constructor() {}
  public static getInstance(): AuthMaillerService {
    if (!AuthMaillerService.instance) {
      AuthMaillerService.instance = new AuthMaillerService()
    }
    return AuthMaillerService.instance
  }
  // end Singleton instance

  /**
   * @description Gửi email chứa mã OTP
   * @param to Địa chỉ email người nhận
   * @param otp Mã OTP
   * @param type Loại OTP (xác thực email hoặc quên mật khẩu)
   */
  public async sendOtpEmail(to: string, otp: string, type: OtpType) {
    const mailContent = generateOtpEmailTemplate(otp, type)
    return maillerService.sendMail({
      to,
      subject: OTP_MESSAGE[type].subject,
      html: mailContent,
    })
  }
}

export const authMaillerService = AuthMaillerService.getInstance()
