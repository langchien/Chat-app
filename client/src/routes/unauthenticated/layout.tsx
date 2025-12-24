import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

export default function UnauthenticatedLayout() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  useEffect(() => {
    if (user) navigate(APP_PAGES.CHAT)
  }, [user, navigate])
  return <Outlet />
}
