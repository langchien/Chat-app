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
import { FriendStatusButton } from '@/features/friend/components/friend-status-btn'
import type { IUser } from '@/types/api.types'
import { UserAvatar } from './avatar'

export function UserInfoModal({ user }: { user: IUser }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className='flex items-center space-x-2 cursor-pointer'>
          <UserAvatar user={user} />
          <div className='flex flex-col text-left'>
            <div className='flex flex-row items-center space-x-2'>
              <div className='font-semibold'>{user.displayName}</div>
              <div className='hidden group-hover/friend:block text-xs text-muted-foreground'>
                @{user.username}
              </div>
            </div>
            <div className='text-xs text-muted-foreground'>{user.email}</div>
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Thông tin người dùng</DialogTitle>
          <DialogDescription>Chi tiết thông tin cá nhân của {user.displayName}</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col items-center gap-4 py-4'>
          <UserAvatar user={user} size='xl' />
          <div className='text-center'>
            <h3 className='text-lg font-semibold capitalize'>{user.displayName}</h3>
            <p className='text-sm text-muted-foreground'>@{user.username}</p>
          </div>
          <div className='w-full grid gap-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='text-sm font-medium'>Email:</span>
              <span className='col-span-3 text-sm'>{user.email}</span>
            </div>
            {user.phone && (
              <div className='grid grid-cols-4 items-center gap-4'>
                <span className='text-sm font-medium'>SĐT:</span>
                <span className='col-span-3 text-sm'>{user.phone}</span>
              </div>
            )}
            {user.bio && (
              <div className='grid grid-cols-4 items-start gap-4'>
                <span className='text-sm font-medium'>Bio:</span>
                <span className='col-span-3 text-sm'>{user.bio}</span>
              </div>
            )}
            <div className='grid grid-cols-4 items-center gap-4'>
              <span className='text-sm font-medium'>Tham gia:</span>
              <span className='col-span-3 text-sm'>
                {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>
          </div>
        </div>
        <DialogFooter className='sm:justify-between'>
          <FriendStatusButton userId={user.id} />
          <DialogClose asChild>
            <Button className='ms-auto' type='button' variant='secondary'>
              Đóng
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
