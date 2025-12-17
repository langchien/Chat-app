import { ChatSidebar } from '@/components/siderbar'
import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/stores/auth.store'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

export default function PrivateLayout() {
  const user = useAuthStore((state) => state.user)
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) navigate(APP_PAGES.SIGNIN)
  }, [user, navigate])
  return <ChatSidebar />
}
