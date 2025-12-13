import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { Eye, EyeOff } from 'lucide-react'
import { type ComponentProps, forwardRef, useState } from 'react'
import { Button } from './button'

export const InputPassword = forwardRef<HTMLInputElement, ComponentProps<'input'>>(
  ({ disabled, ...props }, ref) => {
    const [type, setType] = useState<'password' | 'text'>('password')
    const onClickButton = () => {
      setType((prev) => (prev === 'password' ? 'text' : 'password'))
    }
    return (
      <InputGroup className='overflow-hidden'>
        <InputGroupInput
          placeholder='Nhập mật khẩu'
          disabled={disabled}
          ref={ref}
          {...props}
          type={type}
        />
        <InputGroupAddon align='inline-end'>
          <Button
            type='button'
            onClick={onClickButton}
            size='sm'
            className='rounded-2xl absolute right-1 top-1/2 -translate-y-1/2'
            variant='ghost'
          >
            {type === 'password' ? <EyeOff /> : <Eye />}
          </Button>
        </InputGroupAddon>
      </InputGroup>
    )
  },
)
InputPassword.displayName = 'PasswordInput'
