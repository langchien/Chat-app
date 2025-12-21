import { ChatSidebar } from '@/components/siderbar'
import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/stores/auth.store'
import { redirect } from 'react-router'

export async function clientLoader() {
  const user = useAuthStore.getState().user
  if (!user) {
    throw redirect(APP_PAGES.SIGNIN)
  }
  return null
}

export default function PrivateLayout() {
  return <ChatSidebar />
}
