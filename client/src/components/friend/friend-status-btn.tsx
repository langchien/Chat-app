import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useAppStore } from '@/hooks/stores/app.store'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { useRequest } from '@/hooks/use-request'
import { friendRequest } from '@/services/friend'
import { FriendStatus } from '@/services/friend/friend.res.dto'
import { UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'

interface FriendStatusButtonProps {
  userId: string
  className?: string
  onStatusChange?: (status: FriendStatus) => void
  userDisplayName?: string
}

export function FriendStatusButton({
  userId,
  className,
  onStatusChange,
  userDisplayName,
}: FriendStatusButtonProps) {
  const [status, setStatus] = useState<FriendStatus | null>(null)
  const { isLoading } = useAppStore()
  const { user: currentUser } = useAuthStore()

  // Modal state
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const defaultMessage = `Xin chào, mình là ${currentUser?.displayName}. Kết bạn với mình nhé!`
  const [message, setMessage] = useState(defaultMessage)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await friendRequest.checkFriendStatus(userId)
        setStatus(res)
      } catch {
        // ignore
      }
    }
    fetchStatus()
  }, [userId])

  const onAddFriend = useRequest(
    async (e: React.FormEvent) => {
      e.preventDefault()
      await friendRequest.createFriendRequest({ toId: userId, message })
      setStatus(FriendStatus.REQUEST_SENT)
      onStatusChange?.(FriendStatus.REQUEST_SENT)
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
        setStatus(FriendStatus.NOT_FRIEND)
        onStatusChange?.(FriendStatus.NOT_FRIEND)
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
      setStatus(FriendStatus.NOT_FRIEND)
      onStatusChange?.(FriendStatus.NOT_FRIEND)
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
        setStatus(FriendStatus.FRIEND)
        onStatusChange?.(FriendStatus.FRIEND)
      }
    },
    {
      messageSuccess: 'Đã chấp nhận kết bạn',
      messageError: 'Chấp nhận thất bại',
    },
  )

  if (status === FriendStatus.FRIEND) {
    return (
      <Button variant='destructive' className={className} onClick={onUnfriend} disabled={isLoading}>
        Hủy kết bạn
      </Button>
    )
  }

  if (status === FriendStatus.REQUEST_SENT) {
    return (
      <Button
        variant='secondary'
        className={className}
        onClick={onCancelRequest}
        disabled={isLoading}
      >
        Hủy lời mời
      </Button>
    )
  }

  if (status === FriendStatus.REQUEST_RECEIVED) {
    return (
      <Button className={className} onClick={onAccept} disabled={isLoading}>
        Chấp nhận
      </Button>
    )
  }

  // Not friend logic with Dialog
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className={className} disabled={isLoading}>
          Thêm bạn bè {userDisplayName && <UserPlus className='ml-2 h-4 w-4' />}
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <form onSubmit={onAddFriend}>
          <DialogHeader>
            <DialogTitle>Gửi lời mời kết bạn</DialogTitle>
            <DialogDescription>
              {userDisplayName
                ? `Bạn có muốn gửi lời mời kết bạn cho ${userDisplayName} không?`
                : 'Gửi một lời chào để bắt đầu kết bạn!'}
            </DialogDescription>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <div className='grid gap-3'>
              <Label htmlFor='message'>Tin nhắn</Label>
              <Textarea
                rows={4}
                id='message'
                name='message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type='button' variant='outline'>
                Hủy
              </Button>
            </DialogClose>
            <Button type='submit' disabled={isLoading}>
              Gửi lời mời
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
