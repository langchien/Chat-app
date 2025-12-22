import { APP_PAGES } from '@/constants/link.const'
import { type IRegisterReqBodyDto, RegisterReqBodyDto } from '@/features/auth/services'
import { useRequest } from '@/hooks/use-request'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

export const useSignupForm = () => {
  const { isLoading } = useAppStore()
  const form = useForm<IRegisterReqBodyDto>({
    resolver: zodResolver(RegisterReqBodyDto),
  })
  const signUp = useAuthStore((state) => state.signUp)
  const onSubmit = useRequest(signUp, {
    setError: form.setError,
    messageSuccess: 'Đăng ký thành công!',
    redirectUrl: APP_PAGES.CHAT,
  })
  return { form, onSubmit: form.handleSubmit(onSubmit), isLoading }
}
