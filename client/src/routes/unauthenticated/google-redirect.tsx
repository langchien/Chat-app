import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export default function GoogleRedirect() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const signInWithOAuth2 = useAuthStore((state) => state.signInWithOAuth2)
  useEffect(() => {
    const accessToken = searchParams.get('accessToken')
    if (accessToken) {
      signInWithOAuth2(accessToken)
      navigate(APP_PAGES.CHAT)
    } else navigate(APP_PAGES.SIGNIN)
  }, [searchParams, navigate, signInWithOAuth2])
  return <div>Google Redirecting...</div>
}
