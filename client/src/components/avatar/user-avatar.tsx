import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, getInitials } from '@/lib/utils'
import type { IUser } from '@/types/api.types'
import { cva, type VariantProps } from 'class-variance-authority'
import { OnlineBadge } from './online-badge'

type OnlineStatus = 'online' | 'offline'
const userAvatarVariants = cva('border-2 border-white', {
  variants: {
    size: {
      xs: 'size-6',
      sm: 'size-8',
      md: 'size-11',
      lg: 'size-15',
      xl: 'size-22',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

interface IUserAvatarProps extends VariantProps<typeof userAvatarVariants> {
  user: IUser
  className?: string
  onLineStatus?: OnlineStatus
}

export function UserAvatar({ user, onLineStatus, size, className }: IUserAvatarProps) {
  return (
    <div className='relative w-fit'>
      <Avatar className={cn(userAvatarVariants({ size, className }))}>
        {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.displayName} /> : null}
        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
      </Avatar>
      {onLineStatus && <OnlineBadge isOnline={onLineStatus === 'online'} />}
    </div>
  )
}
