import { Button } from '@/components/ui/button'
import { InputPassword } from '@/components/ui/custom-input'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { APP_PAGES } from '@/constants/link.const'
import { Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { useSignupForm } from '../hooks/use-sign-up-form'

export function SignUpForm() {
  const { form, isLoading, onSubmit } = useSignupForm()
  return (
    <form onSubmit={onSubmit}>
      <FieldGroup className='gap-4'>
        <Controller
          name='username'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='username'>Tên đăng nhập</FieldLabel>
              <Input
                {...field}
                id='username'
                name='username'
                placeholder='Chọn tên đăng nhập'
                aria-invalid={fieldState.invalid}
                autoComplete='off'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='displayName'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='displayName'>Tên hiển thị</FieldLabel>
              <Input
                {...field}
                id='displayName'
                name='displayName'
                placeholder='Nhập tên hiển thị'
                aria-invalid={fieldState.invalid}
                autoComplete='off'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='phone'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='phone'>Số điện thoại (Không bắt buộc)</FieldLabel>
              <Input
                {...field}
                id='phone'
                name='phone'
                placeholder='+84 123 456 789'
                aria-invalid={fieldState.invalid}
                autoComplete='off'
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name='bio'
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor='bio'>Giới thiệu (Không bắt buộc)</FieldLabel>
              <Textarea
                {...field}
                id='bio'
                name='bio'
                placeholder='Giới thiệu về bản thân'
                aria-invalid={fieldState.invalid}
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
              <FieldLabel htmlFor='password'>Mật khẩu</FieldLabel>
              <InputPassword
                {...field}
                id='password'
                name='password'
                placeholder='Nhập mật khẩu của bạn'
                aria-invalid={fieldState.invalid}
                autoComplete='off'
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
          Đăng ký
        </Button>

        <p className='text-center text-sm text-muted-foreground'>
          Đã có tài khoản?{' '}
          <Link to={APP_PAGES.SIGNIN} className='text-blue-400 hover:underline'>
            Đăng nhập
          </Link>
        </p>
      </FieldGroup>
    </form>
  )
}
