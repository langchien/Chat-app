import { APP_PAGES } from '@/constants/link.const'
import { type ILoginReqBodyDto, LoginReqBodyDto } from '@/features/auth/services'
import { UnprocessableEntityException } from '@/lib/request/request.type'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

export const useSignInForm = () => {
  const form = useForm<ILoginReqBodyDto>({
    resolver: zodResolver(LoginReqBodyDto),
  })
  const signIn = useAuthStore((state) => state.signIn)
  const navigate = useNavigate()
  const { setLoading } = useAppStore()

  const onSubmit = async (data: ILoginReqBodyDto) => {
    setLoading(true)
    try {
      await signIn(data)
      toast.success('Đăng nhập thành công!')
      navigate(APP_PAGES.CHAT)
    } catch (error: any) {
      if (error instanceof UnprocessableEntityException) {
        error.errorInfor.errors.forEach((constraint) => {
          if (constraint.path.length > 0)
            form.setError(constraint.path[0].toString() as any, {
              type: 'manual',
              message: constraint.message,
            })
        })
      }
      if (error instanceof Error) {
        toast.error(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const { isLoading } = useAppStore()
  return { form, onSubmit: form.handleSubmit(onSubmit), isLoading }
}
