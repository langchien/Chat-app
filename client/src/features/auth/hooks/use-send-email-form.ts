import { APP_PAGES } from '@/constants/link.const'
import {
  authRequest,
  type ISendOtpReqBodyDto,
  type IVerifyOtpDto,
  SendOtpReqBodyDto,
  VerifyOtp,
} from '@/features/auth/services'
import { useRequest } from '@/hooks/use-request'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export const useSendEmailForm = (type: 'verify' | 'forgot-pasword') => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const { isLoading } = useAppStore()
  const [verifyingEmail, setVerifyingEmail] = useState<string | null>(null)
  const emailForm = useForm<ISendOtpReqBodyDto>({
    resolver: zodResolver(SendOtpReqBodyDto),
  })
  const otpForm = useForm<IVerifyOtpDto>({
    resolver: zodResolver(VerifyOtp),
  })
  const sendVerifyEmail = useAuthStore((state) => state.verifyEmail)
  const sendResetPasswordEmail = useAuthStore((state) => state.verifyResetPasswordEmail)
  const sendFunc =
    type === 'verify' ? authRequest.sendVerifyEmail : authRequest.sendResetPasswordEmail
  const verifyOtpFunc = type === 'verify' ? sendVerifyEmail : sendResetPasswordEmail
  const onSendEmail = useRequest(sendFunc, {
    messageSuccess: 'Đã gửi mã xác thực đến email của bạn.',
    setError: otpForm.setError,
    onSuccess: () => {
      setIsOpen(true)
      const email = emailForm.getValues('email')
      otpForm.reset({ otp: '', email })
      setVerifyingEmail(email)
    },
  })

  const onVerifyOtp = useRequest(verifyOtpFunc, {
    setError: otpForm.setError,
    messageSuccess: 'Xác thực email thành công!',
    redirectUrl: type === 'verify' ? APP_PAGES.SIGNUP : APP_PAGES.RESET_PASSWORD,
  })

  async function onResendEmail() {
    if (!verifyingEmail) return
    await onSendEmail({ email: verifyingEmail })
  }

  const onClose = () => {
    otpForm.reset({ email: '', otp: '' })
    emailForm.reset({ email: '' })
    setIsOpen(false)
  }

  return {
    isLoading,
    emailForm,
    onSendEmail: emailForm.handleSubmit(onSendEmail),
    isOpen,
    onClose,
    verifyingEmail,
    otpForm,
    onVerifyOtp: otpForm.handleSubmit(onVerifyOtp),
    onResendEmail,
  }
}
