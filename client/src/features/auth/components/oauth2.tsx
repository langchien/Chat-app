import { Button } from '@/components/ui/button'
import { authRequest } from '@/features/auth/services'

export function OAuth2Btn() {
  const handleClick = async () => {
    const { url } = await authRequest.getGoogleOAuth2Url()
    window.location.href = url
  }
  return (
    <Button
      onClick={handleClick}
      type='button'
      variant='outline'
      className='w-full border-red-500 hover:border-red-600 text-red-600 hover:text-red-700'
    >
      <img src='/google-icon.png' className='size-6' alt='Google Icon' /> Đăng nhập với Google
    </Button>
  )
}
