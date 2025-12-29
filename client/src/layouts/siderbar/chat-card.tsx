import { ChatAvatar } from '@/components/avatar'
import { Card } from '@/components/ui/card'
import { APP_PAGES } from '@/constants/link.const'
import { useChatName } from '@/hooks/use-chat-name'
import { cn, formatTimeAgo } from '@/lib/utils'
import { useAuthStore } from '@/stores/auth.store'
import type { IChat } from '@/types/api.types'
import { Link } from 'react-router'

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
        <div className='flex-1 text-left space-y-1 text-sm min-w-0'>
          <div className='font-bold line-clamp-1 min-w-0 capitalize'>{chatName}</div>
          {chatItem.lastMessage ? (
            <div className='text-xs text-muted-foreground line-clamp-1 min-w-0'>
              <b className='capitalize'>
                {isLastSender ? 'Bạn' : (lastSender?.displayName ?? 'Người dùng').split(' ')[0]}
                :{' '}
              </b>
              <span>{chatItem.lastMessage.content}</span>
            </div>
          ) : (
            <div className='text-xs text-muted-foreground line-clamp-1 min-w-0'>
              Hãy bắt đầu cuộc trò chuyện
            </div>
          )}
        </div>
        <div className='ms-auto text-xs text-muted-foreground h-full align-top'>
          {formatTimeAgo(chatItem.updatedAt)}
        </div>
      </Card>
    </Link>
  )
}
