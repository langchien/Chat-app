import { APP_PAGES } from '@/constants/link.const'
import { useChatName } from '@/hooks/use-chat-name'
import { cn, formatTimeAgo } from '@/lib/utils'
import type { IChat } from '@/services/api.types'
import { useAuthStore } from '@/stores/auth.store'
import { Link } from 'react-router'
import { ChatAvatar } from '../avatar'
import { Card } from '../ui/card'

export function ChatCard({ chatItem, activeChatId }: { chatItem: IChat; activeChatId?: string }) {
  const chatName = useChatName(chatItem).chatDisplayName
  const lastSender = chatItem.participants.find(
    (p) => p.user.id === chatItem.lastMessage?.senderId,
  )?.user
  const user = useAuthStore((state) => state.user)
  const isLastSender = lastSender?.id === user?.id
  return (
    <Link to={`${APP_PAGES.CHAT}/${chatItem.id}`} key={`chatItem-${chatItem.id}`}>
      <Card
        className={cn(
          'min-h-14 flex flex-row items-center p-3 hover:bg-primary/10 space-x-3 bg-card text-card-foreground',
          chatItem.id === activeChatId && 'bg-primary/10 border-l-4 border-primary',
        )}
      >
        <ChatAvatar chatItem={chatItem} />
        <div className='flex-1 text-left space-y-1  text-sm '>
          <div className='font-bold line-clamp-1 min-w-0 capitalize'>{chatName}</div>
          {lastSender?.displayName && chatItem.lastMessage ? (
            <div className='text-xs text-muted-foreground line-clamp-1 min-w-0'>
              <b className='capitalize'>
                {isLastSender ? 'Bạn' : lastSender.displayName.split(' ')[0]}:{' '}
              </b>
              {chatItem.lastMessage.content}
            </div>
          ) : (
            <p>...</p>
          )}
        </div>
        <div className='ms-auto text-xs text-muted-foreground h-full align-top'>
          {formatTimeAgo(chatItem.updatedAt)}
        </div>
      </Card>
    </Link>
  )
}
