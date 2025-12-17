import { UnprocessableEntityException } from '@/lib/request/request.type'
import { useCallback } from 'react'
import type { UseFormSetError } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { useAppStore } from '../stores/app.store'

interface UseRequestOptions<R = any> {
  redirectUrl?: string
  messageSuccess?: string
  messageError?: string
  omitDelay?: boolean
  onSuccess?: (data: R) => void
  onError?: (error: any) => void
  setError?: UseFormSetError<any>
}

interface UseFormSubmitOptions<R = any> extends Omit<UseRequestOptions<R>, 'setError'> {}

export const useRequest = <T extends any[], R = any>(
  cb: (...args: T) => Promise<R>,
  options: UseRequestOptions<R>,
) => {
  const { redirectUrl, messageError, messageSuccess, onError, onSuccess, setError } = options
  const { setLoading } = useAppStore()
  const navigate = useNavigate()
  // dùng useCallback để tránh tạo lại hàm onRequest mỗi lần render
  const onRequest = useCallback(
    async (...args: T) => {
      setLoading(true)
      try {
        const res = await cb(...args)
        if (messageSuccess) toast.success(messageSuccess)
        if (redirectUrl) navigate(redirectUrl)
        if (onSuccess) onSuccess(res)
      } catch (error: any) {
        if (setError && error instanceof UnprocessableEntityException) {
          error.errorInfor.errors.forEach((constraint) => {
            if (constraint.path.length > 0)
              setError(constraint.path[0].toString(), {
                type: 'manual',
                message: constraint.message,
              })
          })
        }
        if (messageError) toast.error(messageError)
        else if (error instanceof Error) toast.error(error.message)
        if (onError) onError(error)
      } finally {
        setLoading(false)
      }
    },
    [
      cb,
      messageError,
      messageSuccess,
      navigate,
      onError,
      onSuccess,
      redirectUrl,
      setError,
      setLoading,
    ],
  )
  return onRequest
}

export const useFormSubmit = <T extends any[], R = any>(
  cb: (...args: T) => Promise<R>,
  setError: UseFormSetError<any>,
  options: UseFormSubmitOptions<R>,
) => {
  return useRequest<T, R>(cb, { ...options, setError })
}
