import { friendRequest } from '@/features/friend/services'
import { RequestList } from '../components/request-list'
import type { Route } from './+types/request'

export async function clientLoader() {
  const sendReuqest = await friendRequest.getSentFriendRequests()
  return { sendReuqest }
}

export default function RequestPage({ loaderData }: Route.ComponentProps) {
  const { sendReuqest } = loaderData
  return <RequestList requests={sendReuqest} />
}
