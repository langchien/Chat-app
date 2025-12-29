import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/stores/auth.store'
import { redirect } from 'react-router'
import { AuthLayout } from '../components/auth-layout'
import { ResetPasswordForm } from '../components/reset-password-form'

export async function clientLoader() {
  const isCanResetPassword = useAuthStore.getState().isCanResetPassword
  if (!isCanResetPassword) {
    throw redirect(APP_PAGES.SIGNIN)
  }
  return null
}

export default function ResetPasswordPage() {
  return (
    <>
      <AuthLayout title='Đặt lại mật khẩu' subtitle='Nhập mật khẩu mới của bạn'>
        <ResetPasswordForm />
      </AuthLayout>
    </>
  )
}
