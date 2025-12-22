import { APP_PAGES } from '@/constants/link.const'
import { type ILoginReqBodyDto, LoginReqBodyDto } from '@/features/auth/services'
import { useRequest } from '@/hooks/use-request'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useSignInForm = () => {
  const form = useForm<ILoginReqBodyDto>({
    resolver: zodResolver(LoginReqBodyDto),
  })
  const signIn = useAuthStore((state) => state.signIn)
  const onSubmit = useRequest(signIn, {
    redirectUrl: APP_PAGES.CHAT,
    setError: form.setError,
    messageSuccess: 'Đăng nhập thành công!',
  })
  const { isLoading } = useAppStore()
  return { form, onSubmit: form.handleSubmit(onSubmit), isLoading }
}
