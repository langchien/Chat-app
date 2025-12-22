import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/components/ui/input-otp'
import { APP_PAGES } from '@/constants/link.const'
import { Fragment } from 'react'
import { Controller } from 'react-hook-form'
import { Link } from 'react-router'
import { useSendEmailForm } from '../hooks/use-send-email-form'
import { OAuth2Btn } from './oauth2'

export const SendEmailForm = ({ type }: { type: 'verify' | 'forgot-pasword' }) => {
  const {
    emailForm,
    isLoading,
    onVerifyOtp,
    otpForm,
    verifyingEmail,
    onSendEmail,
    onResendEmail,
    isOpen,
    onClose,
  } = useSendEmailForm(type)
  return (
    <Fragment>
      <form onSubmit={onSendEmail}>
        <FieldGroup>
          <Controller
            name='email'
            control={emailForm.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor='email'>Email đăng ký</FieldLabel>
                <Input
                  {...field}
                  id='email'
                  type='email'
                  placeholder='Nhập email đăng ký'
                  aria-invalid={fieldState.invalid}
                  autoComplete='email'
                />
                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
              </Field>
            )}
          />
          <Button className='w-full bg-blue-600 hover:bg-blue-700 text-white mt-2' type='submit'>
            Tiếp tục
          </Button>
          {type === 'verify' && <OAuth2Btn />}

          <p className='text-center text-sm text-muted-foreground'>
            Hoặc
            <Link to={APP_PAGES.SIGNIN} className=' pl-1 text-blue-400 hover:underline'>
              Đăng nhập
            </Link>
          </p>
        </FieldGroup>
      </form>
      <Dialog open={isOpen}>
        <DialogContent className='p-0 max-w-lg'>
          <DialogHeader className='bg-[#f4f6f8] py-5 rounded-2xl'>
            <DialogTitle className='text-xl text-center'>Xác thực email</DialogTitle>
          </DialogHeader>
          <div className='p-5'>
            <p className='text-center text-lg'>
              Nhập mã OTP được gửi qua email <span className='font-semibold'>{verifyingEmail}</span>
            </p>
            <form onSubmit={onVerifyOtp} className='py-5 space-y-5'>
              <Controller
                name='otp'
                control={otpForm.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <InputOTP maxLength={6} {...field} containerClassName='justify-center flex'>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    {fieldState.invalid && (
                      <FieldError className='w-full text-center' errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Button
                disabled={isLoading}
                size='lg'
                variant='destructive'
                type='submit'
                className='w-full'
              >
                Xác nhận
              </Button>
            </form>
            <div className='flex items-center justify-center gap-5'>
              <Button
                className='border-blue-600 text-blue-500'
                size='lg'
                variant='outline'
                onClick={onClose}
              >
                Quay lại
              </Button>
              <Button
                className='border-blue-600 text-blue-500'
                size='lg'
                variant='outline'
                type='button'
                onClick={onResendEmail}
              >
                Gửi lại OTP
              </Button>
            </div>
            <p className='text-center text-gray-500 my-5'>Mã OTP có thời hạn 5 phút</p>
          </div>
        </DialogContent>
      </Dialog>
    </Fragment>
  )
}
