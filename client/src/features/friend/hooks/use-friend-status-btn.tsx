import { friendRequest } from '@/features/friend/services'
import { useQuery } from '@/hooks/use-query'
import { useRequest } from '@/hooks/use-request'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { useState } from 'react'

export function useFriendStatusBtn(userId: string) {
  const { isLoading } = useAppStore()
  const { user: currentUser } = useAuthStore()
  const isCurrentUser = currentUser?.id === userId
  // Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const defaultMessage = `Xin chào, mình là ${currentUser?.displayName}. Kết bạn với mình nhé!`
  const [message, setMessage] = useState(defaultMessage)

  const { data: status } = useQuery(friendRequest.checkFriendStatus, userId)

  const onAddFriend = useRequest(
    async (e: React.FormEvent) => {
      e.preventDefault()
      await friendRequest.createFriendRequest({ toId: userId, message })
      setIsDialogOpen(false)
    },
    {
      messageSuccess: 'Đã gửi lời mời kết bạn',
      messageError: 'Gửi lời mời thất bại',
    },
  )

  const onCancelRequest = useRequest(
    async () => {
      const sentRequests = await friendRequest.getSentFriendRequests()
      const req = sentRequests.find((r) => r.to.id === userId)
      if (req) {
        await friendRequest.deleteFriendRequest(req.id)
      }
    },
    {
      messageSuccess: 'Đã hủy lời mời',
      messageError: 'Hủy lời mời thất bại',
    },
  )

  const onUnfriend = useRequest(
    async () => {
      await friendRequest.deleteFriendByUserId(userId)
    },
    {
      messageSuccess: 'Đã hủy kết bạn',
      messageError: 'Hủy kết bạn thất bại',
    },
  )

  const onAccept = useRequest(
    async () => {
      const receivedRequests = await friendRequest.getReceivedFriendRequests()
      const req = receivedRequests.find((r) => r.from.id === userId)
      if (req) {
        await friendRequest.updateFriendRequestStatus(req.id, { status: 'accepted' })
      }
    },
    {
      messageSuccess: 'Đã chấp nhận kết bạn',
      messageError: 'Chấp nhận thất bại',
    },
  )
  return {
    isLoading,
    message,
    isDialogOpen,
    status,
    isCurrentUser,
    onAddFriend,
    setIsDialogOpen,
    setMessage,
    onCancelRequest,
    onUnfriend,
    onAccept,
  }
}
