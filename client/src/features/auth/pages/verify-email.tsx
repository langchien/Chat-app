import { AuthLayout } from '../components/auth-layout'
import { SendEmailForm } from '../components/send-email-form'

export default function VerifyEmailPage() {
  return (
    <AuthLayout title='Đăng ký' subtitle='Nhập email của bạn để tạo tài khoản'>
      <SendEmailForm type='verify' />
    </AuthLayout>
  )
}
