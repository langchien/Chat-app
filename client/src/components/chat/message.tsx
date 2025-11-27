import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, formatMessageTime, getInitials } from '@/lib/utils'
import type { IMessage, IUser } from '@/services/api.types'

export function Message({
  message,
  userId,
  mapUserById,
}: {
  message: IMessage
  userId?: string
  mapUserById: Map<string, IUser>
}) {
  const isOwnMessage = message.senderId === userId
  return (
    <div className={cn('flex mb-5', isOwnMessage ? 'justify-end' : 'justify-start', 'gap-3')}>
      {!isOwnMessage && (
        <Avatar className='h-8 w-8'>
          <AvatarImage
            src={mapUserById.get(message.senderId)?.avatarUrl ?? ''}
            alt={mapUserById.get(message.senderId)?.displayName}
          />
          <AvatarFallback>
            {getInitials(mapUserById.get(message.senderId)?.displayName ?? 'U')}
          </AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'max-w-xs px-4 py-2 rounded-2xl relative',
          isOwnMessage ? 'bg-blue-500 text-white' : 'bg-muted text-foreground',
        )}
      >
        <p className='text-sm'>{message.content}</p>
        <span className='absolute text-xs text-foreground/60 right-2 -bottom-1 translate-y-full text-right text-nowrap'>
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}
