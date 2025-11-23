import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'

export default function GoogleRedirect() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const setAccessToken = useAuthStore((state) => state.setAccessToken)
  useEffect(() => {
    const isSuccess = searchParams.get('status') === 'success'
    if (isSuccess) {
      const tokens = Object.fromEntries(searchParams.entries())
      // todo: xử lý typescript cho tokens
      setAccessToken(tokens['accessToken'] ?? '')
      navigate(APP_PAGES.CHAT)
    } else navigate(APP_PAGES.SIGNIN)
  }, [searchParams, navigate, setAccessToken])
  return <div>Google Redirecting...</div>
}
