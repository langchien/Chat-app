import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { InputPassword } from '@/components/ui/custom-input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { APP_PAGES } from '@/constants/link.const'
import { CheckCircle2 } from 'lucide-react'
import { Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { useResetPassword } from '../hooks/use-reset-password-form'

export function ResetPasswordForm() {
  const { form, onSubmit, isLoading, success } = useResetPassword()
  if (success) {
    return (
      <div className='space-y-4'>
        <Alert className='border-green-200 bg-green-50 text-green-800'>
          <CheckCircle2 className='h-4 w-4' />
          <AlertDescription>
            Mật khẩu của bạn đã được đặt lại thành công! Bạn có thể đăng nhập với mật khẩu mới.
          </AlertDescription>
        </Alert>

        <Link to={APP_PAGES.SIGNIN}>
          <Button type='button' className='w-full'>
            Quay lại đăng nhập
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup className='gap-4'>
        <Controller
          name='password'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='password'>Mật khẩu mới</FieldLabel>
              <InputPassword
                {...field}
                id='password'
                name='password'
                placeholder='Nhập mật khẩu mới'
                aria-invalid={fieldState.invalid}
                autoComplete='new-password'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='confirmPassword'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='confirmPassword'>Xác nhận mật khẩu</FieldLabel>
              <InputPassword
                {...field}
                id='confirmPassword'
                name='confirmPassword'
                placeholder='Nhập lại mật khẩu'
                aria-invalid={fieldState.invalid}
                autoComplete='off'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button size='lg' type='submit' className='w-full' disabled={isLoading}>
          Đặt lại mật khẩu
        </Button>
      </FieldGroup>
    </form>
  )
}
