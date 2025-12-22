import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/stores/auth.store'
import { redirect } from 'react-router'
import { AuthLayout } from '../components/auth-layout'
import { SignUpForm } from '../components/sign-up-form'

export async function clientLoader() {
  const isCanSignUp = useAuthStore.getState().isCanSignUp
  if (!isCanSignUp) {
    throw redirect(APP_PAGES.VERIFY_EMAIL)
  }
  return null
}

export default function SignUpPage() {
  return (
    <>
      <AuthLayout title='Tạo tài khoản' subtitle='Tham gia cộng đồng chat ngay hôm nay'>
        <SignUpForm />
      </AuthLayout>
    </>
  )
}
