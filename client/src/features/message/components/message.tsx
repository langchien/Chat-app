import { UserAvatar } from '@/components/avatar'
import { MessageMedia } from '@/features/message/components/message-media'
import { cn, formatMessageTime } from '@/lib/utils'
import type { IMessage, IUser } from '@/types/api.types'

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
  const user = mapUserById.get(message.senderId)
  const medias = message.medias || []
  return (
    <div className={cn('flex mb-5', isOwnMessage ? 'justify-end' : 'justify-start', 'gap-3')}>
      {!isOwnMessage && user && <UserAvatar user={user} />}
      <div className='max-w-md md:max-w-lg lg:max-w-xl flex flex-col space-y-1'>
        <MessageMedia medias={medias} />
        {message.content && (
          <p
            className={cn(
              'px-4 py-2 rounded-2xl relative text-sm max-w-fit',
              isOwnMessage ? 'bg-blue-500 text-white' : 'bg-muted text-foreground',
            )}
          >
            {message.content}
          </p>
        )}
        <span className=' text-xs text-foreground/60 text-right text-nowrap'>
          {formatMessageTime(message.createdAt)}
        </span>
      </div>
    </div>
  )
}
