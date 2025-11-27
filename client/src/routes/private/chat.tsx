import { ChatHeader } from '@/components/chat/chat-header'
import { ChatWindow } from '@/components/chat/chat-window'
import { ChatWindowSkeleton } from '@/components/chat/chat-window-skeleton'
import { chatRequest } from '@/services/chats'
import { messageRequest } from '@/services/messages'
import { Suspense } from 'react'
import { Await } from 'react-router'
import type { Route } from './+types/chat'

const DEFAULT_PAGINATION_LIMIT = 20
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const chatId = params.chatId

  const messagesPromise = messageRequest.paginateMessagesByChatId(chatId, {
    limit: DEFAULT_PAGINATION_LIMIT,
  })
  const chat = await chatRequest.getById(chatId)
  return {
    messages: messagesPromise,
    chat,
    chatId,
  }
}

export default function ChatPage({ loaderData }: Route.ComponentProps) {
  return (
    <div className='relative h-screen bg-background flex flex-col'>
      <ChatHeader chat={loaderData.chat} />
      <Suspense key={loaderData.chat.id} fallback={<ChatWindowSkeleton />}>
        <Await resolve={loaderData.messages}>
          {(value) => <ChatWindow paginateMessages={value} />}
        </Await>
      </Suspense>
    </div>
  )
}
