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
import { FriendStatus } from '@/features/friend/services/friend.res.dto'
import { UserPlus } from 'lucide-react'
import { useFriendStatusBtn } from '../hooks/use-friend-status-btn'

interface FriendStatusButtonProps {
  userId: string
  className?: string
  userDisplayName?: string
}

function Btn({
  status,
  isLoading,
  onClick,
  className,
}: {
  className?: string
  status: FriendStatus
  isLoading: boolean
  onClick: () => void
}) {
  if (status === FriendStatus.FRIEND) {
    return (
      <Button variant='destructive' className={className} onClick={onClick} disabled={isLoading}>
        Hủy kết bạn
      </Button>
    )
  }

  if (status === FriendStatus.REQUEST_SENT) {
    return (
      <Button variant='secondary' className={className} onClick={onClick} disabled={isLoading}>
        Hủy lời mời
      </Button>
    )
  }

  if (status === FriendStatus.REQUEST_RECEIVED) {
    return (
      <Button className={className} onClick={onClick} disabled={isLoading}>
        Chấp nhận
      </Button>
    )
  }
  return null
}
export function FriendStatusButton({
  userId,
  className,
  userDisplayName,
}: FriendStatusButtonProps) {
  const {
    isDialogOpen,
    isLoading,
    status,
    setIsDialogOpen,
    onAddFriend,
    message,
    setMessage,
    onCancelRequest,
    onUnfriend,
    onAccept,
    isCurrentUser,
  } = useFriendStatusBtn(userId)

  if (isCurrentUser) {
    return null
  }
  if (status === FriendStatus.FRIEND) {
    return <Btn status={status} isLoading={isLoading} onClick={onUnfriend} className={className} />
  }

  if (status === FriendStatus.REQUEST_SENT) {
    return (
      <Btn status={status} isLoading={isLoading} onClick={onCancelRequest} className={className} />
    )
  }

  if (status === FriendStatus.REQUEST_RECEIVED) {
    return <Btn status={status} isLoading={isLoading} onClick={onAccept} className={className} />
  }

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
