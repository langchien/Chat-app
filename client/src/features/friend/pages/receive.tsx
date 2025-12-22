import { friendRequest } from '@/features/friend/services'
import { ReceiveRequest } from '../components/receive-request'
import type { Route } from './+types/receive'

export async function clientLoader() {
  const receiveRequest = await friendRequest.getReceivedFriendRequests()
  return { receiveRequest }
}

export default function ReceiveRequestPage({ loaderData }: Route.ComponentProps) {
  const { receiveRequest } = loaderData
  return <ReceiveRequest requests={receiveRequest} />
}
