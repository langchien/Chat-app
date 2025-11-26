import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { useChatStore } from '@/hooks/stores/chat.store'
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
  const chatList = useChatStore((state) => state.data)
  const hasMore = useChatStore((state) => state.hasMore)
  const getMore = useChatStore((state) => state.getMore)
  const { chatId } = useParams()
  const chatGroups = chatList.filter((chat) => chat.type === 'group')
  const chatDirects = chatList.filter((chat) => chat.type === 'direct')
  return (
    <div id='scrollableConversationList' className='app-scroll max-h-svh overflow-auto'>
      <InfiniteScroll
        dataLength={chatList.length}
        next={getMore}
        hasMore={hasMore}
        scrollThreshold={0.8}
        loader={<Loading />}
        endMessage={<EndChat />}
        scrollableTarget='scrollableConversationList'
      >
        <SidebarContent>
          {chatList.length === 0 ? (
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
