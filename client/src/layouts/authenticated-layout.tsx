import { APP_PAGES } from '@/constants/link.const'
import { chatRequest } from '@/features/chat/services'
import { protectedRequest } from '@/features/user/services/protected'
import { ChatSidebar } from '@/layouts/siderbar'
import { useAuthStore } from '@/stores/auth.store'
import { redirect } from 'react-router'
import type { Route } from './+types/authenticated-layout'

const INIT_LIMIT = 20

export async function clientLoader() {
  const { accessToken } = useAuthStore.getState()
  if (!accessToken) {
    throw redirect(APP_PAGES.SIGNIN)
  }
  try {
    const userRes = await protectedRequest.getProfile()
    useAuthStore.getState().setUser(userRes)
  } catch {
    useAuthStore.getState().clearAuthStore()
    throw redirect(APP_PAGES.SIGNIN)
  }
  const chatPaginateData = await chatRequest.paginate({
    limit: INIT_LIMIT,
  })
  return { chatPaginateData }
}

export default function AuthenticatedLayout({ loaderData }: Route.ComponentProps) {
  return <ChatSidebar paginateData={loaderData.chatPaginateData} />
}
