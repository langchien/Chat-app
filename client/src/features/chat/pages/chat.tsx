import { chatRequest } from '@/features/chat/services'
import { messageRequest } from '@/features/message/services'
import { Suspense } from 'react'
import { Await } from 'react-router'
import { ChatHeader } from '../components/chat-header'
import { ChatInput } from '../components/chat-input'
import { ChatWindow } from '../components/chat-window'
import { ChatWindowSkeleton } from '../components/chat-window-skeleton'
import type { Route } from './+types/chat'

const DEFAULT_PAGINATION_LIMIT = 20
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const chatId = params.chatId

  const messagesPromise = messageRequest.paginateMessagesByChatId(chatId, {
    limit: DEFAULT_PAGINATION_LIMIT,
  })
  const chat = await chatRequest.getById(chatId)

  // Fetch deferred data (no await)
  const linksPromise = chatRequest.getLinks(chatId)
  const mediaPromise = chatRequest.getMedia(chatId)

  return {
    messages: messagesPromise,
    chat,
    chatId,
    linksPromise,
    mediaPromise,
  }
}

export default function ChatPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className='h-full flex-1 flex flex-col overflow-auto'>
      <ChatHeader />
      <Suspense key={loaderData.chat.id} fallback={<ChatWindowSkeleton />}>
        <Await resolve={loaderData.messages}>
          {(value) => <ChatWindow paginateMessages={value} />}
        </Await>
      </Suspense>
      <ChatInput chatId={loaderData.chat.id} />
    </div>
  )
}
