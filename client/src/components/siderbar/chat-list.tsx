import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Spinner } from '@/components/ui/spinner'
import { useChatList } from '@/hooks/use-chat-list'
import InfiniteScroll from 'react-infinite-scroll-component'
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
  const { data, chatGroups, chatDirects, chatId, getMore, hasMore } = useChatList()
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
              <SidebarGroupChat chatGroups={chatGroups} activeChatId={chatId} />
              <SidebarDirectChat chatDirects={chatDirects} activeChatId={chatId} />
            </>
          )}
        </SidebarContent>
      </InfiniteScroll>
    </div>
  )
}
