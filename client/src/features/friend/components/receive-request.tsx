import { UserAvatar } from '@/components/avatar'
import { Button } from '@/components/ui/button'
import { friendRequest } from '@/features/friend/services'
import { useRequest } from '@/hooks/use-request'
import { useAppStore } from '@/stores/app.store'
import type { IReceivedFriendRequest } from '@/types/api.types'
import { format } from 'date-fns'
import { Check, X } from 'lucide-react'
import { useRevalidator } from 'react-router'

export function ReceiveRequest({ requests }: { requests: IReceivedFriendRequest[] }) {
  const { isLoading } = useAppStore()
  const revalidator = useRevalidator()

  const onAccept = useRequest(
    async (id: string) => {
      await friendRequest.updateFriendRequestStatus(id, { status: 'accepted' })
      revalidator.revalidate()
    },
    {
      messageSuccess: 'Đã chấp nhận kết bạn',
      messageError: 'Chấp nhận thất bại',
    },
  )

  const onReject = useRequest(
    async (id: string) => {
      await friendRequest.updateFriendRequestStatus(id, { status: 'rejected' })
      revalidator.revalidate()
    },
    {
      messageSuccess: 'Đã từ chối kết bạn',
      messageError: 'Từ chối thất bại',
    },
  )

  return (
    <div className='flex flex-col space-y-2 py-3'>
      {requests.length === 0 && (
        <div className='text-center text-muted-foreground'>Không có lời mời nào</div>
      )}
      {requests.map((req) => (
        <div key={req.id} className='flex items-center justify-between p-3 border rounded-lg'>
          <div className='flex items-center gap-3'>
            <UserAvatar user={req.from} />
            <div className='flex flex-col'>
              <span className='font-semibold'>{req.from.displayName}</span>
              <span className='text-xs text-muted-foreground'>
                {format(new Date(req.createdAt), 'dd/MM/yyyy')}
              </span>
              {req.message && (
                <span className='text-xs text-muted-foreground line-clamp-1'>
                  &quot;{req.message}&quot;
                </span>
              )}
            </div>
          </div>
          <div className='flex gap-2'>
            <Button
              size='icon'
              onClick={() => onAccept(req.id)}
              className='h-8 w-8 text-green-500'
              variant='ghost'
              disabled={isLoading || req.status !== 'pending'}
            >
              <Check className='w-4 h-4' />
            </Button>
            <Button
              size='icon'
              onClick={() => onReject(req.id)}
              className='h-8 w-8 text-red-500'
              variant='ghost'
              disabled={isLoading || req.status !== 'pending'}
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
