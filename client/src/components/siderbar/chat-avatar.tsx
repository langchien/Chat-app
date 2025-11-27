import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSocketStore } from '@/hooks/stores/socket.store'
import { getInitials } from '@/lib/utils'
import type { IChat } from '@/services/api.types'
import { Ellipsis } from 'lucide-react'
import { OnlineBadge } from './online-badge'

interface ChatAvatarProps {
  chatItem: IChat
  userId?: string
  isGroup?: boolean
}

export function ChatAvatar({ chatItem, userId, isGroup }: ChatAvatarProps) {
  const onlineUsers = useSocketStore((state) => state.onlineUsers)
  const users = chatItem.participants.map((p) => p.user)
  if (isGroup) {
    if (users.length > 3) {
      return (
        <div className='flex -space-x-4'>
          {users.slice(0, 2).map((user) => (
            <Avatar key={user.id} className='size-9 border-2 border-white'>
              {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.displayName} /> : null}
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
          ))}
          <Avatar className='size-9 border-2 border-white bg-blue-50 flex items-center justify-center'>
            <Ellipsis size={20} className='text-blue-600 mx-auto my-auto' />
          </Avatar>
        </div>
      )
    }
    return (
      <div className='flex -space-x-4'>
        {users.slice(0, 3).map((user) => (
          <Avatar key={user.id} className='size-9 border-2 border-white'>
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.displayName} /> : null}
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    )
  }
  const firstUser = users.filter((u) => u.id !== userId)[0]
  const isOnline = onlineUsers.includes(firstUser.id)
  return (
    <div className='relative'>
      <Avatar className='size-10'>
        {firstUser.avatarUrl ? (
          <AvatarImage src={firstUser.avatarUrl} alt={firstUser.displayName} />
        ) : null}
        <AvatarFallback>{getInitials(firstUser.displayName)}</AvatarFallback>
      </Avatar>
      <OnlineBadge isOnline={isOnline} />
    </div>
  )
}
