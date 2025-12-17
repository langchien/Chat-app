import { Button } from '@/components/ui/button'
import { useRequest } from '@/hooks/use-request'
import type { ISentFriendRequest } from '@/services/api.types'
import { friendRequest } from '@/services/friend'
import { useAppStore } from '@/stores/app.store'
import { format } from 'date-fns'
import { useNavigate } from 'react-router'
import { UserAvatar } from '../avatar'

export function RequestList({ requests }: { requests: ISentFriendRequest[] }) {
  const { isLoading } = useAppStore()
  const navigation = useNavigate()

  const onCancel = useRequest(
    async (id: string) => {
      await friendRequest.deleteFriendRequest(id)
      navigation('.', { replace: true })
    },
    {
      messageSuccess: 'Đã hủy lời mời',
      messageError: 'Hủy lời mời thất bại',
    },
  )

  return (
    <div className='flex flex-col space-y-2 py-3'>
      {requests.length === 0 && (
        <div className='text-center text-muted-foreground'>Chưa gửi lời mời nào</div>
      )}
      {requests.map((req) => (
        <div key={req.id} className='flex items-center justify-between p-3 border rounded-lg'>
          <div className='flex items-center gap-3'>
            <UserAvatar user={req.to} />
            <div className='flex flex-col'>
              <span className='font-semibold'>{req.to.displayName}</span>
              <span className='text-xs text-muted-foreground'>
                {format(new Date(req.createdAt), 'dd/MM/yyyy')}
              </span>
            </div>
          </div>
          <Button
            size='sm'
            variant='outline'
            onClick={() => onCancel(req.id)}
            disabled={isLoading || req.status !== 'pending'}
          >
            Hủy
          </Button>
        </div>
      ))}
    </div>
  )
}
