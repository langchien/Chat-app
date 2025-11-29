import { SOCKET_EVENTS } from '@/constants/event.const'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { useSocketStore } from '@/hooks/stores/socket.store'
import type { clientLoader } from '@/routes/private/chat'
import type { IChat, IMessage, IMessagePaginate, IUser } from '@/services/api.types'
import { messageRequest } from '@/services/messages'
import { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useLoaderData } from 'react-router'
import { Skeleton } from '../ui/skeleton'
import { ChatInput } from './chat-input'
import { Message } from './message'

function LoadingMessageItem() {
  return (
    <div className='flex justify-center py-4'>
      <Skeleton className='h-5 w-40 bg-gray-300 rounded-full' />
    </div>
  )
}
function EndMessage() {
  return (
    <div className='py-4 text-center text-sm text-muted-foreground'>
      Bạn đã xem hết tất cả các tin nhắn
    </div>
  )
}
const DEFAULT_PAGINATION_LIMIT = 20
export function ChatWindow({ paginateMessages }: { paginateMessages: IMessagePaginate }) {
  const { chat } = useLoaderData<typeof clientLoader>()
  const socket = useSocketStore((state) => state.socket)
  const [messages, setMessages] = useState(paginateMessages.data)
  const [hasMore, setHasMore] = useState(paginateMessages.hasMore)
  const [nextCursor, setNextCursor] = useState(paginateMessages.nextCursor)
  useEffect(() => {
    if (!socket) return
    const handleReceiveMessage = (payload: { message: IMessage; chat: IChat }) => {
      if (payload.chat.id !== chat.id) return
      setMessages((prevMessages) => [payload.message, ...prevMessages])
    }
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
    }
  }, [socket, chat.id])
  const allUserInChat = chat.participants.map((p) => p.user)
  const mapUserById = new Map<string, IUser>(allUserInChat.map((user) => [user.id, user]))
  const user = useAuthStore((state) => state.user)
  const userId = user?.id
  const fetchData = useCallback(async () => {
    if (!nextCursor) return
    const response = await messageRequest.paginateMessagesByChatId(chat.id, {
      limit: DEFAULT_PAGINATION_LIMIT,
      cursor: nextCursor,
    })
    setMessages((prevMessages) => [...prevMessages, ...response.data])
    setNextCursor(response.nextCursor)
    setHasMore(response.hasMore)
  }, [nextCursor, chat.id])
  return (
    <>
      <div id='scrollableChatWindow' className='app-scroll flex flex-col-reverse p-4 overflow-auto'>
        <InfiniteScroll
          dataLength={messages.length}
          next={fetchData}
          className='flex flex-col-reverse'
          hasMore={hasMore}
          loader={<LoadingMessageItem />}
          endMessage={<EndMessage />}
          scrollableTarget='scrollableChatWindow'
          inverse={true}
        >
          <div className='space-y-4 flex flex-col-reverse'>
            {messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                userId={userId}
                mapUserById={mapUserById}
              />
            ))}
          </div>
        </InfiniteScroll>
      </div>
      <ChatInput chatId={chat.id} />
    </>
  )
}
