import { AuthLayout } from '@/components/auth/auth-layout'
import { SignUpForm } from '@/components/auth/sign-up-form'
import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function SignUpPage() {
  const isCanSignUp = useAuthStore((state) => state.isCanSignUp)
  const navigate = useNavigate()
  useEffect(() => {
    if (!isCanSignUp) navigate(APP_PAGES.VERIFY_EMAIL)
  }, [isCanSignUp, navigate])
  return (
    <>
      {isCanSignUp && (
        <AuthLayout title='Tạo tài khoản' subtitle='Tham gia cộng đồng chat ngay hôm nay'>
          <SignUpForm />
        </AuthLayout>
      )}
    </>
  )
}
