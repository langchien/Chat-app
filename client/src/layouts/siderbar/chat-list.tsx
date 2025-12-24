import { Item, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { SidebarContent } from '@/components/ui/sidebar'
import { Spinner } from '@/components/ui/spinner'
import { useChatList } from '@/features/chat/hooks/use-chat-list'
import type { IChatPaginateCursorResDto } from '@/features/chat/services'
import { EmptyChat } from '@/layouts/siderbar/empty-chat'
import { SidebarDirectChat } from '@/layouts/siderbar/sidebar-direct-chat'
import { SidebarGroupChat } from '@/layouts/siderbar/sidebar-group-chat'
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

export function ChatList({ paginateData }: { paginateData: IChatPaginateCursorResDto }) {
  const { chatList, chatGroups, chatDirects, chatId, getMore, hasMore } = useChatList(paginateData)
  return (
    <div
      id='scrollableConversationList'
      className='app-scroll h-full flex-1 overflow-y-auto min-h-0'
    >
      <InfiniteScroll
        dataLength={chatList.length}
        next={getMore}
        hasMore={hasMore}
        scrollThreshold={0.8}
        loader={<Loading />}
        endMessage={<EndChat hidden={chatList.length === 0} />}
        scrollableTarget='scrollableConversationList'
      >
        <SidebarContent>
          {chatList.length === 0 ? (
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
