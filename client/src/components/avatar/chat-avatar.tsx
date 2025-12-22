import { Avatar } from '@/components/ui/avatar'
import { useChatName } from '@/hooks/use-chat-name'
import { cn } from '@/lib/utils'
import { useSocketStore } from '@/stores/socket.store'
import type { IChat } from '@/types/api.types'
import { Ellipsis } from 'lucide-react'
import { UserAvatar } from './user-avatar'

interface ChatAvatarProps {
  chatItem: IChat
  size?: 'sm' | 'md' | 'lg'
}

export function ChatAvatar({ chatItem, size = 'md' }: ChatAvatarProps) {
  const onlineUsers = useSocketStore((state) => state.onlineUsers)
  const users = chatItem.participants.map((p) => p.user)
  const isGroup = chatItem.type === 'group'
  const { directChatMember } = useChatName(chatItem)
  const isOnline = onlineUsers.includes(directChatMember.user.id)

  if (isGroup) {
    const avatarCommonClasses = cn('size-9 border-2 border-white', {
      'size-14': size === 'lg',
      'size-8': size === 'sm',
    })

    const ellipsisCommonClasses = cn(
      'border-2 size-9 border-white bg-blue-50 flex items-center justify-center',
      {
        'size-14': size === 'lg',
        'size-8': size === 'sm',
      },
    )

    const ellipsisIconClasses = cn('text-blue-600 mx-auto my-auto', {
      'size-6': size === 'lg',
      'size-4': size === 'sm',
    })

    if (users.length > 3) {
      return (
        <div className='flex -space-x-4'>
          {users.slice(0, 2).map((user) => (
            <UserAvatar key={user.id} user={user} className={avatarCommonClasses} />
          ))}
          <Avatar className={ellipsisCommonClasses}>
            <Ellipsis className={ellipsisIconClasses} />
          </Avatar>
        </div>
      )
    }
    return (
      <div className='flex -space-x-4'>
        {users.slice(0, 3).map((user) => (
          <UserAvatar key={user.id} user={user} className={avatarCommonClasses} />
        ))}
      </div>
    )
  }

  return (
    <UserAvatar
      user={directChatMember.user}
      onLineStatus={isOnline ? 'online' : undefined}
      size={size}
    />
  )
}
