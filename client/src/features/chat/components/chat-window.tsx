import { Skeleton } from '@/components/ui/skeleton'
import { useChatWindow } from '@/features/chat/hooks/use-chat-window'
import { Message } from '@/features/message/components/message'
import type { IMessagePaginate } from '@/types/api.types'
import InfiniteScroll from 'react-infinite-scroll-component'

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
export function ChatWindow({ paginateMessages }: { paginateMessages: IMessagePaginate }) {
  const { messages, hasMore, fetchData, userId, mapUserById } = useChatWindow(paginateMessages)

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
    </>
  )
}
