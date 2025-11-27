import { ChatInfo } from '@/components/chat/chat-info'
import { ChatInput } from '@/components/chat/chat-input'
import { ChatWindow } from '@/components/chat/chat-window'
import { ChatWindowSkeleton } from '@/components/chat/chat-window-skeleton'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { Phone, Video } from 'lucide-react'
import { Suspense } from 'react'
import { Await } from 'react-router'
import type { Route } from './+types/chat'

const PAGINATE = {
  page: 1,
  limit: 20,
}

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  // const conversation = await chatRequest.getConversationById(params.conversationId)
  // const messages = messageRequest.getMessageByConversationId(params.conversationId, PAGINATE)
  // return { conversation, messages, conversationId: params.conversationId }
}

export default function ChatPage({ loaderData }: Route.ComponentProps) {
  const user = useAuthStore((state) => state.user)
  const userId = user?.id
  return (
    <div className='relative h-screen bg-background flex flex-col'>
      {/* Header */}
      <div className='sticky top-0 z-10 bg-white shadow-sm border-b border-border p-4 flex items-center justify-between'>
        <div>
          <h2 className='font-bold text-lg'>{conversationName}</h2>
        </div>
        <div className='flex gap-2'>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <Phone className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <Video className='h-5 w-5' />
          </Button>
          <ChatInfo conversation={conversation} />
        </div>
      </div>

      {/*  ChatWindow */}
      <Suspense key={conversation.id} fallback={<ChatWindowSkeleton />}>
        <Await resolve={loaderData.messages}>
          {(value) => <ChatWindow paginateMessages={value} />}
        </Await>
      </Suspense>
      <ChatInput conversationId={conversation.id} />
    </div>
  )
}
