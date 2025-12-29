import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/stores/auth.store'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export default function GoogleRedirect() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const signInWithOAuth2 = useAuthStore((state) => state.signInWithOAuth2)

  useEffect(() => {
    const handleSignIn = async () => {
      const accessToken = searchParams.get('accessToken')
      if (!accessToken) {
        navigate(APP_PAGES.SIGNIN)
        return
      }

      try {
        await signInWithOAuth2(accessToken)
        navigate(APP_PAGES.CHAT)
      } catch (error) {
        navigate(APP_PAGES.SIGNIN)
      }
    }

    handleSignIn()
  }, [searchParams, navigate, signInWithOAuth2])

  return <div>Google Redirecting...</div>
}
