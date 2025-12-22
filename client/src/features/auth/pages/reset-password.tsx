import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/stores/auth.store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { AuthLayout } from '../components/auth-layout'
import { ResetPasswordForm } from '../components/reset-password-form'

export default function ResetPasswordPage() {
  const isCanResetPassword = useAuthStore((state) => state.isCanResetPassword)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isCanResetPassword) navigate(APP_PAGES.FORGOT_PASSWORD)
  }, [isCanResetPassword, navigate])
  return (
    <>
      {isCanResetPassword && (
        <AuthLayout title='Đặt lại mật khẩu' subtitle='Nhập mật khẩu mới của bạn'>
          <ResetPasswordForm />
        </AuthLayout>
      )}
    </>
  )
}
