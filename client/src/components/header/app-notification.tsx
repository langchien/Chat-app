import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Skeleton } from '@/components/ui/skeleton'
import { friendRequest } from '@/features/friend/services'
import {
  useMarkAllRead,
  useMarkRead,
  useNotificationSocket,
  useNotifications,
} from '@/features/notification/hooks'
import { formatDistanceToNow } from 'date-fns'
import { vi } from 'date-fns/locale'
import { Bell } from 'lucide-react'
import { useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { toast } from 'sonner'

export function AppNotification() {
  const [open, setOpen] = useState(false)

  // Hooks
  const {
    notifications,
    loadMore,
    hasMore,
    addNotification,
    markAsReadLocally,
    markAllReadLocally,
  } = useNotifications()
  useNotificationSocket(addNotification)

  const markReadRequest = useMarkRead()
  const markAllReadRequest = useMarkAllRead()

  const unreadCount = notifications.filter((n) => !n.isRead).length
  const [loadingMarkAll, setLoadingMarkAll] = useState(false)

  const handleMarkAllRead = async () => {
    setLoadingMarkAll(true)
    try {
      await markAllReadRequest()
      markAllReadLocally()
    } finally {
      setLoadingMarkAll(false)
    }
  }

  const handleMarkRead = async (id: string, isRead: boolean) => {
    if (!isRead) {
      markAsReadLocally(id) // Optimistic update
      await markReadRequest(id)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size={'icon-sm'} variant='ghost' className='relative'>
          <Bell className='size-5 text-muted-foreground' />
          {unreadCount > 0 && (
            <span className='absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white'>
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-80 p-0' align='end'>
        <div className='flex items-center justify-between border-b px-4 py-3'>
          <h4 className='font-semibold'>Thông báo</h4>
          <Button
            variant='ghost'
            size='sm'
            className='h-auto px-2 text-xs text-muted-foreground hover:text-foreground'
            onClick={handleMarkAllRead}
            disabled={loadingMarkAll}
          >
            Đánh dấu đã đọc
          </Button>
        </div>
        <div id='scrollableNotification' className='h-[350px] overflow-y-auto'>
          {notifications.length === 0 ? (
            <div className='flex h-32 items-center justify-center text-sm text-muted-foreground'>
              Không có thông báo mới
            </div>
          ) : (
            <InfiniteScroll
              dataLength={notifications.length}
              next={loadMore}
              hasMore={hasMore}
              loader={
                <div className='flex justify-center p-2'>
                  <Skeleton className='h-4 w-24' />
                </div>
              }
              scrollableTarget='scrollableNotification'
              className='divide-y'
            >
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`flex gap-3 p-3 transition-colors hover:bg-muted/50 cursor-pointer ${
                    !notif.isRead ? 'bg-primary/5' : ''
                  }`}
                  onClick={() => handleMarkRead(notif.id, notif.isRead)}
                >
                  <Avatar className='h-9 w-9'>
                    <AvatarImage src={notif.sender?.avatarUrl} />
                    <AvatarFallback>{notif.sender?.displayName?.[0] || 'S'}</AvatarFallback>
                  </Avatar>
                  <div className='flex-1 space-y-1'>
                    <p className='text-sm leading-tight'>
                      {notif.sender && (
                        <span className='font-semibold'>{notif.sender.displayName} </span>
                      )}
                      {notif.type === 'FRIEND_REQUEST' ? 'đã gửi lời mời kết bạn.' : notif.content}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {formatDistanceToNow(new Date(notif.createdAt), {
                        addSuffix: true,
                        locale: vi,
                      })}
                    </p>

                    {notif.type === 'FRIEND_REQUEST' && (
                      <ActionButtons notif={notif} handleMarkRead={handleMarkRead} />
                    )}
                  </div>
                  {!notif.isRead && <div className='mt-2 h-2 w-2 rounded-full bg-primary' />}
                </div>
              ))}
            </InfiniteScroll>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}

function ActionButtons({
  notif,
  handleMarkRead,
}: {
  notif: any // Typing properly would be better but reusing existing loose types
  handleMarkRead: (id: string, isRead: boolean) => void
}) {
  const [status, setStatus] = useState<string>(notif.actionStatus || 'NONE')

  const handleAccept = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!notif.sender) return
    try {
      setStatus('ACCEPTED')
      await friendRequest.acceptByUserId(notif.sender.id)
      toast.success('Đã chấp nhận lời mời kết bạn')
      handleMarkRead(notif.id, notif.isRead)
    } catch (error) {
      setStatus('NONE')
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleReject = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!notif.sender) return
    try {
      setStatus('REJECTED')
      await friendRequest.rejectByUserId(notif.sender.id)
      toast.success('Đã từ chối lời mời kết bạn')
      handleMarkRead(notif.id, notif.isRead)
    } catch (error) {
      setStatus('NONE')
      toast.error('Có lỗi xảy ra')
    }
  }

  if (status === 'ACCEPTED') {
    return <p className='mt-2 text-xs font-medium text-green-600'>Đã chấp nhận</p>
  }

  if (status === 'REJECTED') {
    return <p className='mt-2 text-xs font-medium text-red-600'>Đã từ chối</p>
  }

  return (
    <div className='mt-2 flex gap-2'>
      <Button size='sm' className='h-7 px-3 text-xs' onClick={handleAccept}>
        Chấp nhận
      </Button>
      <Button size='sm' variant='outline' className='h-7 px-3 text-xs' onClick={handleReject}>
        Từ chối
      </Button>
    </div>
  )
}
