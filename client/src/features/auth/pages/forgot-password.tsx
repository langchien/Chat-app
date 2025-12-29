import { AuthLayout } from '../components/auth-layout'
import { SendEmailForm } from '../components/send-email-form'

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title='Quên mật khẩu' subtitle='Chúng tôi sẽ gửi mã OTP để đặt lại mật khẩu'>
      <SendEmailForm type='forgot-pasword' />
    </AuthLayout>
  )
}
