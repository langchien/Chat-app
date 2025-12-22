import { Button } from '@/components/ui/button'
import { UserInfoModal } from '@/components/user-info-modal'
import type { IParticipant } from '@/types/api.types'
import { UserPlus } from 'lucide-react'

export function ChatMemberList({ participants }: { participants: IParticipant[] }) {
  // todo: xử lý hiển thị change nick name trong chat
  return (
    <div className='flex flex-col space-y-2'>
      <Button variant={'secondary'} className='w-full'>
        <UserPlus /> Thêm thành viên mới
      </Button>
      {participants.map((participant) => (
        <UserInfoModal key={participant.user.id} user={participant.user} />
      ))}
    </div>
  )
}
