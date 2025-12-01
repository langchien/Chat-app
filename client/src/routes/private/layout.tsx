import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

export default function PrivateLayout() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) navigate(APP_PAGES.SIGNIN)
  }, [user, navigate])
  return <Outlet />
}
