import { FriendList } from '@/components/friend/friend-list'
import { friendRequest } from '@/services/friend'
import type { Route } from './+types/list'

export async function clientLoader() {
  const friends = await friendRequest.getListFriend()
  return { friends }
}

export default function FriendListPage({ loaderData }: Route.ComponentProps) {
  const { friends } = loaderData
  return <FriendList friends={friends} />
}
