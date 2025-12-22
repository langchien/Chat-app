import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/stores/auth.store'
import { Outlet, redirect } from 'react-router'

export async function clientLoader() {
  const user = useAuthStore.getState().user
  if (user) {
    throw redirect(APP_PAGES.CHAT)
  }
  return null
}

export default function UnauthenticatedLayout() {
  return <Outlet />
}
