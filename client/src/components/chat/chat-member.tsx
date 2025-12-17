import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import type { IParticipant, IUser } from '@/services/api.types'
import { useAuthStore } from '@/stores/auth.store'
import { UserPlus } from 'lucide-react'
import { ProfileTabs } from '../profile/profile-tabs'
import { UserInfo } from '../siderbar/account-setting'
import { Button } from '../ui/button'

export function ChatMemberItem({ user }: { user: IUser }) {
  const currentUser = useAuthStore((state) => state.user)
  return (
    <div className='flex items-center justify-between w-full h-full group'>
      <UserInfo user={user} />
      <Dialog>
        <DialogTrigger asChild></DialogTrigger>
        <DialogContent className='max-w-xl md:max-w-3xl lg:max-w-4xl min-h-[400px]'>
          <ProfileTabs />
        </DialogContent>
      </Dialog>
      {user.id === currentUser?.id ? (
        <Button variant={'ghost'}>Bạn</Button>
      ) : (
        <Button>Kết bạn</Button>
      )}
    </div>
  )
}

export function ChatMemberList({ participants }: { participants: IParticipant[] }) {
  // todo: Xử lý xem ai là bạn bè rồi thì hiện nút nhắn tin thay vì kết bạn
  // todo: xử lý hiển thị change nick name trong chat
  return (
    <div className='flex flex-col space-y-2'>
      <Button variant={'secondary'} className='w-full'>
        <UserPlus /> Thêm thành viên mới
      </Button>
      {participants.map((participant) => (
        <ChatMemberItem key={participant.user.id} user={participant.user} />
      ))}
    </div>
  )
}
