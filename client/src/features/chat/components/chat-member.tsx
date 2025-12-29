import { Button } from '@/components/ui/button'
import { UserInfoModal } from '@/components/user-info-modal'
import { chatRequest } from '@/features/chat/services/chat.request'
import type { IChatResDto } from '@/features/chat/services/chat.res.dto'
import { useRequest } from '@/hooks/use-request'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import { Trash2, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { AddMemberModal } from './add-member-modal'

import { ChatType } from '@/features/chat/services/chat.schema'

export function ChatMemberList({ chat }: { chat: IChatResDto }) {
  const { user } = useAuthStore()
  const [openAddMember, setOpenAddMember] = useState(false)
  const { isLoading } = useAppStore()

  const removeMember = useRequest(
    async (userId: string) => {
      await chatRequest.removeMember(chat.id, userId)
    },
    {
      onSuccess: () => {
        toast.success('Xóa thành viên thành công')
      },
      onError: () => {
        toast.error('Xóa thành viên thất bại')
      },
    },
  )

  const isCreator = chat.groupInfo?.createdBy === user?.id
  // Filter active participants
  const activeParticipants = chat.participants.filter((p) => !p.deletedAt)
  const isGroup = chat.type === ChatType.GROUP

  return (
    <div className='flex flex-col space-y-2'>
      {isGroup && (
        <Button variant={'secondary'} className='w-full' onClick={() => setOpenAddMember(true)}>
          <UserPlus /> Thêm thành viên mới
        </Button>
      )}

      {activeParticipants.map((participant) => (
        <div key={participant.user.id} className='flex items-center justify-between group'>
          <UserInfoModal user={participant.user} />
          {isCreator && participant.user.id !== user?.id && (
            <Button
              variant='ghost'
              size='icon'
              className='opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10'
              onClick={() => removeMember(participant.user.id)}
              disabled={isLoading}
            >
              <Trash2 size={16} />
            </Button>
          )}
        </div>
      ))}

      <AddMemberModal chat={chat} open={openAddMember} onOpenChange={setOpenAddMember} />
    </div>
  )
}
