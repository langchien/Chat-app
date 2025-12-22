import { PageHeader } from '@/components/header/page-header'
import { TabsList, TabsTrigger } from '@/components/ui/tabs'

export const FRIEND_TABS = {
  title: 'title',
  listFriend: 'list-friend',
  addFriend: 'add-friend',
  request: 'request',
  receiveRequest: 'receive-request',
}

export function FriendHeader() {
  return (
    <PageHeader>
      <TabsList>
        <TabsTrigger value={FRIEND_TABS.listFriend}>Danh sách bạn bè</TabsTrigger>
        <TabsTrigger value={FRIEND_TABS.addFriend}>Thêm bạn bè</TabsTrigger>
        <TabsTrigger value={FRIEND_TABS.request}>Yêu cầu đã gửi</TabsTrigger>
        <TabsTrigger value={FRIEND_TABS.receiveRequest}>Yêu cầu đã nhận</TabsTrigger>
      </TabsList>
    </PageHeader>
  )
}
