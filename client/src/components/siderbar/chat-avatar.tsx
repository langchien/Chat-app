import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSocketStore } from '@/hooks/stores/socket.store'
import { useChatName } from '@/hooks/use-chat-name'
import { cn, getInitials } from '@/lib/utils'
import type { IChat } from '@/services/api.types'
import { Ellipsis } from 'lucide-react'
import { OnlineBadge } from './online-badge'

interface ChatAvatarProps {
  chatItem: IChat
  size?: 'sm' | 'md' | 'lg'
}

export function ChatAvatar({ chatItem, size = 'md' }: ChatAvatarProps) {
  const onlineUsers = useSocketStore((state) => state.onlineUsers)
  const users = chatItem.participants.map((p) => p.user)
  const isGroup = chatItem.type === 'group'
  const { directChatMember } = useChatName(chatItem)
  if (isGroup) {
    if (users.length > 3) {
      return (
        <div className='flex -space-x-4'>
          {users.slice(0, 2).map((user) => (
            <Avatar
              key={user.id}
              className={cn('size-9 border-2 border-white', {
                'size-14': size === 'lg',
                'size-8': size === 'sm',
              })}
            >
              {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.displayName} /> : null}
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
          ))}
          <Avatar
            className={cn(
              'border-2 size-9 border-white bg-blue-50 flex items-center justify-center',
              {
                'size-14': size === 'lg',
                'size-8': size === 'sm',
              },
            )}
          >
            <Ellipsis
              className={cn('text-blue-600 mx-auto my-auto', {
                'size-6': size === 'lg',
                'size-4': size === 'sm',
              })}
            />
          </Avatar>
        </div>
      )
    }
    return (
      <div className='flex -space-x-4'>
        {users.slice(0, 3).map((user) => (
          <Avatar
            key={user.id}
            className={cn('size-9 border-2 border-white', {
              'size-14': size === 'lg',
              'size-8': size === 'sm',
            })}
          >
            {user.avatarUrl ? <AvatarImage src={user.avatarUrl} alt={user.displayName} /> : null}
            <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    )
  }
  const isOnline = onlineUsers.includes(directChatMember.user.id)
  return (
    <div className='relative w-fit'>
      <Avatar
        className={cn('size-11 border-2 border-white', {
          'size-15': size === 'lg',
          'size-8': size === 'sm',
        })}
      >
        {directChatMember.user.avatarUrl ? (
          <AvatarImage
            src={directChatMember.user.avatarUrl}
            alt={directChatMember.user.displayName}
          />
        ) : null}
        <AvatarFallback>{getInitials(directChatMember.user.displayName)}</AvatarFallback>
      </Avatar>
      <OnlineBadge isOnline={isOnline} />
    </div>
  )
}
