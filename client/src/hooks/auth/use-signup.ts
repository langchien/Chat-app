import { APP_PAGES } from '@/constants/link.const'
import { useAppStore } from '@/hooks/stores/app.store'
import { useRequest } from '@/hooks/use-request'
import { type IRegisterReqBodyDto, RegisterReqBodyDto } from '@/services/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '../stores/auth.store'

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
