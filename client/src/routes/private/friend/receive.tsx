import { ReceiveRequest } from '@/components/friend/receive-request'
import { friendRequest } from '@/services/friend'
import type { Route } from './+types/receive'

export async function clientLoader() {
  const receiveRequest = await friendRequest.getReceivedFriendRequests()
  return { receiveRequest }
}

export default function ReceiveRequestPage({ loaderData }: Route.ComponentProps) {
  const { receiveRequest } = loaderData
  return <ReceiveRequest requests={receiveRequest} />
}
