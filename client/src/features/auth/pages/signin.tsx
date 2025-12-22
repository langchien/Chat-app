import { AuthLayout } from '../components/auth-layout'
import { SignInForm } from '../components/sign-in-form'

export default function SignInPage() {
  return (
    <AuthLayout title='Chào mừng trở lại' subtitle='Đăng nhập vào tài khoản của bạn'>
      <SignInForm />
    </AuthLayout>
  )
}
