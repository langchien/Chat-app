import { useChatList } from '@/components/chat/chat-list/use-chat-list'
import { EmptyChat } from '@/components/siderbar/empty-chat'
import { SidebarDirectChat } from '@/components/siderbar/sidebar-direct-chat'
import { SidebarGroupChat } from '@/components/siderbar/sidebar-group-chat'
import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { SidebarContent } from '@/components/ui/sidebar'
import { Spinner } from '@/components/ui/spinner'
import InfiniteScroll from 'react-infinite-scroll-component'

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

function EndChat({ hidden }: { hidden?: boolean }) {
  return (
    <div hidden={hidden} className='py-4 text-center text-sm text-muted-foreground'>
      Bạn đã xem hết tất cả các cuộc trò chuyện
    </div>
  )
}

export function ChatList() {
  const { data, chatGroups, chatDirects, chatId, getMore, hasMore } = useChatList()
  return (
    <div
      id='scrollableConversationList'
      className='app-scroll h-full flex-1 overflow-y-auto min-h-0'
    >
      <InfiniteScroll
        dataLength={data.length}
        next={getMore}
        hasMore={hasMore}
        scrollThreshold={0.8}
        loader={<Loading />}
        endMessage={<EndChat hidden={data.length === 0} />}
        scrollableTarget='scrollableConversationList'
      >
        <SidebarContent>
          {data.length === 0 ? (
            <EmptyChat />
          ) : (
            <>
              <SidebarDirectChat chatDirects={chatDirects} activeChatId={chatId} />
              <SidebarGroupChat chatGroups={chatGroups} activeChatId={chatId} />
            </>
          )}
        </SidebarContent>
      </InfiniteScroll>
    </div>
  )
}
