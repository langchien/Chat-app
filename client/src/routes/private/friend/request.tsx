import { RequestList } from '@/components/friend/request-list'
import { friendRequest } from '@/services/friend'
import type { Route } from './+types/request'

export async function clientLoader() {
  const sendReuqest = await friendRequest.getSentFriendRequests()
  return { sendReuqest }
}

export default function RequestPage({ loaderData }: Route.ComponentProps) {
  const { sendReuqest } = loaderData
  return <RequestList requests={sendReuqest} />
}
