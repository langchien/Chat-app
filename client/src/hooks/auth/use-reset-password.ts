import { useAuthStore } from '@/hooks/stores/auth.store'
import {
  type IResetPasswordReqBodyDto,
  ResetPasswordReqBodyDto,
} from '@/services/auth/auth.req.dto'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAppStore } from '../stores/app.store'
import { useRequest } from '../use-request'

export const useResetPassword = () => {
  const form = useForm<IResetPasswordReqBodyDto>({
    resolver: zodResolver(ResetPasswordReqBodyDto),
  })
  const { isLoading } = useAppStore()
  const [success, setSuccess] = useState(false)
  const resetPassword = useAuthStore((state) => state.resetPassword)

  const onSubmit = useRequest(resetPassword, {
    setError: form.setError,
    messageSuccess: 'Đặt lại mật khẩu thành công!!',
    onSuccess: () => setSuccess(true),
  })
  return {
    form,
    onSubmit: form.handleSubmit(onSubmit),
    isLoading,
    success,
  }
}
