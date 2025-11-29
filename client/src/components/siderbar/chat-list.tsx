import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'
import { SOCKET_EVENTS } from '@/constants/event.const'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { useChatStore } from '@/hooks/stores/chat.store'
import { useSocketStore } from '@/hooks/stores/socket.store'
import type { IChat, IMessage } from '@/services/api.types'
import { useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router'
import { SidebarContent, SidebarGroup } from '../ui/sidebar'
import { SidebarDirectChat } from './sidebar-direct-chat'
import { SidebarGroupChat } from './sidebar-group-chat'

function Loading() {
  return (
    <Item variant='muted' className=' text-center'>
      <ItemMedia>
        <Spinner />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className='line-clamp-1'>Đang tải...</ItemTitle>
      </ItemContent>
    </Item>
  )
}

function EndChat() {
  return (
    <div className='py-4 text-center text-sm text-muted-foreground'>
      Bạn đã xem hết tất cả các cuộc trò chuyện
    </div>
  )
}

export function ChatList() {
  const user = useAuthStore((state) => state.user)
  const { data, setChatList, getMore, hasMore } = useChatStore()
  const { chatId } = useParams()
  const chatGroups = data.filter((chat) => chat.type === 'group')
  const chatDirects = data.filter((chat) => chat.type === 'direct')
  const socket = useSocketStore((state) => state.socket)

  useEffect(() => {
    if (!socket) return
    const handleReceiveMessage = (payload: { message: IMessage; chat: IChat }) => {
      const _data = data.filter((c) => c.id !== payload.chat.id)
      setChatList([payload.chat, ..._data])
    }
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
    }
  }, [socket, data, setChatList])
  return (
    <div id='scrollableConversationList' className='app-scroll max-h-svh overflow-auto'>
      <InfiniteScroll
        dataLength={data.length}
        next={getMore}
        hasMore={hasMore}
        scrollThreshold={0.8}
        loader={<Loading />}
        endMessage={<EndChat />}
        scrollableTarget='scrollableConversationList'
      >
        <SidebarContent>
          {data.length === 0 ? (
            <SidebarGroup>
              <div className='text-center py-8 text-muted-foreground'>
                Không tìm thấy cuộc trò chuyện
              </div>
            </SidebarGroup>
          ) : (
            <>
              <SidebarGroupChat chatGroups={chatGroups} activeChatId={chatId} userId={user?.id} />
              <SidebarDirectChat
                chatDirects={chatDirects}
                activeChatId={chatId}
                userId={user?.id}
              />
            </>
          )}
        </SidebarContent>
      </InfiniteScroll>
    </div>
  )
}
