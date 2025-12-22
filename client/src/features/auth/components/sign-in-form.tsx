import { Button } from '@/components/ui/button'
import { InputPassword } from '@/components/ui/custom-input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { APP_PAGES } from '@/constants/link.const'
import { Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { useSignInForm } from '../hooks/use-sign-in-form'
import { OAuth2Btn } from './oauth2'

export function SignInForm() {
  const { form, onSubmit, isLoading } = useSignInForm()
  return (
    <form onSubmit={onSubmit}>
      <FieldGroup className='gap-4'>
        <Controller
          name='email'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='email'>Email đăng nhập</FieldLabel>
              <Input
                {...field}
                id='email'
                name='email'
                type='email'
                placeholder='Nhập email đăng nhập'
                aria-invalid={fieldState.invalid}
                autoComplete='email'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='password'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <div className='flex items-center justify-between'>
                <FieldLabel htmlFor='password'>Mật khẩu</FieldLabel>
                <Link
                  to={APP_PAGES.FORGOT_PASSWORD}
                  className='text-xs text-blue-400 hover:underline'
                >
                  Quên mật khẩu?
                </Link>
              </div>

              <InputPassword
                {...field}
                id='password'
                name='password'
                placeholder='Nhập mật khẩu'
                aria-invalid={fieldState.invalid}
                autoComplete='current-password'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Button size='lg' type='submit' className='w-full' disabled={isLoading}>
          Đăng nhập
        </Button>
        <OAuth2Btn />

        <p className='text-center text-sm text-muted-foreground'>
          Chưa có tài khoản?{' '}
          <Link to={APP_PAGES.SIGNUP} className='text-blue-400 hover:underline'>
            Đăng ký
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
