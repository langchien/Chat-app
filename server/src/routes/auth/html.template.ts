import { OtpType } from './otp-request.schema'

interface IOtpData {
  subject: string
  description: string
}

export const OTP_MESSAGE: Record<OtpType, IOtpData> = {
  [OtpType.ResetPasswordReqBodyDto]: {
    subject: 'Khôi phục mật khẩu ✔',
    description:
      'Bạn đang đăng nhập vào hệ thống của Huster Chap-app. Sử dụng mã OTP bên dưới để kích hoạt khôi phục mật khẩu. Mã OTP chỉ có hiệu lực trong 5 phút.',
  },
  [OtpType.VerifyEmail]: {
    subject: 'Xác thực tài khoản ✔',
    description:
      'Bạn đang đăng ký tài khoản trên hệ thống của Huster Chap-app. Sử dụng mã OTP bên dưới để xác thực email. Mã OTP chỉ có hiệu lực trong 5 phút.',
  },
}

export const generateOtpEmailTemplate = (otp: string, type: OtpType) => {
  return `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #4CAF50;">${OTP_MESSAGE[type].subject}</h2>
        <p>${OTP_MESSAGE[type].description}</p>
        <div style="margin: 20px 0; padding: 10px; background-color: #f4f4f4; border-radius: 5px; display: inline-block;">
          <span style="font-size: 24px; letter-spacing: 4px; font-weight: bold;">${otp}</span>
        </div>
        <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
        <br/>
        <p><b>Trân trọng,<br/>Đội ngũ Huster Chat-app</b></p>
      </div>
    `
}
