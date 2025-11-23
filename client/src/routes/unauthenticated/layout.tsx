import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router'

export default function UnauthenticatedLayout() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const navigate = useNavigate()
  useEffect(() => {
    if (isAuthenticated) navigate(APP_PAGES.CHAT)
  }, [isAuthenticated, navigate])
  return <Outlet />
}
