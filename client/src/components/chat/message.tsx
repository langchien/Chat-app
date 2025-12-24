import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn, formatMessageTime, getInitials } from '@/lib/utils'
import type { IMessage, IUser } from '@/services/api.types'
import { MessageMedia } from '../media/message-media'

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
  const medias = message.medias || []
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
      <div className='max-w-md md:max-w-lg lg:max-w-xl flex flex-col space-y-1'>
        <MessageMedia medias={medias} />
        <p
          className={cn(
            'px-4 py-2 rounded-2xl relative text-sm max-w-fit',
            isOwnMessage ? 'bg-blue-500 text-white' : 'bg-muted text-foreground',
          )}
        >
          {message.content}
        </p>
        <span className=' text-xs text-foreground/60 text-right text-nowrap'>
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}
