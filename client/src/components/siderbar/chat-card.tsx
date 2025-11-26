import { APP_PAGES } from '@/constants/link.const'
import { cn, formatTimeAgo } from '@/lib/utils'
import type { IChat } from '@/services/api.types'
import { Link } from 'react-router'
import { Card } from '../ui/card'
import { ChatAvatar } from './chat-avatar'

function getChatName(chatItem: IChat, userId?: string) {
  if (chatItem.type === 'group' && chatItem.groupInfo) return chatItem.groupInfo.name
  const participant = chatItem.participants.find((p) => p.user.id !== userId)
  return participant ? participant.user.displayName : 'Không xác định'
}
export function ChatCard({
  chatItem,
  activeChatId,
  userId,
}: {
  chatItem: IChat
  activeChatId?: string
  userId?: string
}) {
  const chatName = getChatName(chatItem, userId)
  const lastSender = chatItem.participants.find(
    (p) => p.user.id === chatItem.lastMessage?.senderId,
  )?.user
  return (
    <Link to={`${APP_PAGES.CHAT}/${chatItem.id}`} key={`chatItem-${chatItem.id}`}>
      <Card
        className={cn(
          'min-h-14 flex flex-row items-center p-3 bg-linear-to-br from-blue-200 to-blue-100 rounded-2xl hover:border-blue-500 hover:to-blue-200 hover:from-blue-100 transition-all duration-300 group border border-blue-400',
          chatItem.id === activeChatId &&
            'from-blue-300 to-blue-200 rounded-2xl hover:to-blue-300 hover:from-blue-200 border-blue-500 ',
        )}
      >
        <ChatAvatar chatItem={chatItem} userId={userId} isGroup={chatItem.type === 'group'} />
        <div className='flex-1 text-left space-y-1'>
          <div className='font-bold text-sm line-clamp-1 min-w-0 capitalize'>{chatName}</div>
          <div className='text-xs text-muted-foreground line-clamp-1 min-w-0'>
            <b className='capitalize'>{lastSender?.displayName?.split(' ')[0]}: </b>
            {chatItem.lastMessage?.content}
          </div>
        </div>
        <div className='ms-auto text-xs text-muted-foreground h-full align-top'>
          {formatTimeAgo(chatItem.updatedAt)}
        </div>
      </Card>
    </Link>
  )
}
