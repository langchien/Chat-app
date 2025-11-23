import { AuthLayout } from '@/components/auth/auth-layout'
import { SendEmailForm } from '@/components/auth/send-email-form'

export default function VerifyEmailPage() {
  return (
    <AuthLayout title='Đăng ký' subtitle='Nhập email của bạn để tạo tài khoản'>
      <SendEmailForm type='verify' />
    </AuthLayout>
  )
}
