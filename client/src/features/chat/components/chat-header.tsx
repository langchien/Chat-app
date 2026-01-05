import { ChatAvatar } from '@/components/avatar'
import { PageHeader } from '@/components/header/page-header'
import { Button } from '@/components/ui/button'
import { useCall } from '@/features/call/context/call.context'
import { useChatName } from '@/hooks/use-chat-name'
import { useAuthStore } from '@/stores/auth.store'
import { Phone } from 'lucide-react'
import { useLoaderData } from 'react-router'
import { PrevVideoCallSetupModal } from '../../call/components/prev-video-call-seup-modal'
import type { clientLoader } from '../pages/chat'
import { ChatInfo } from './chat-info'

export function ChatHeader() {
  const { chat } = useLoaderData<typeof clientLoader>()
  const { chatDisplayName } = useChatName(chat)
  const { startCall } = useCall()
  const { user } = useAuthStore()

  // Find the other user in the chat
  const targetUser = chat.participants.find((p) => p.user.id !== user?.id)?.user

  const handleStartCall = (stream: MediaStream, isVideo: boolean) => {
    // This is for Video Call Modal support
    if (targetUser) {
      startCall(targetUser, { isVideo })
    }
  }

  const handleVoiceCall = () => {
    if (targetUser) {
      startCall(targetUser, { isVideo: false })
    }
  }

  return (
    <PageHeader>
      <div className='rounded-none h-full shadow-none flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center space-x-3'>
          <ChatAvatar chatItem={chat} size='sm' />
          <h2 className='font-bold text-lg min-w-0 line-clamp-1 capitalize'>{chatDisplayName}</h2>
        </div>
        <div className='flex gap-2'>
          {chat.type === 'direct' && (
            <>
              <Button variant='ghost' size='icon' onClick={handleVoiceCall}>
                <Phone className='w-5 h-5 text-muted-foreground' />
              </Button>

              <PrevVideoCallSetupModal
                onJoin={(stream) => handleStartCall(stream, true)}
                onCancel={() => {}}
              />
            </>
          )}

          <ChatInfo />
        </div>
      </div>
    </PageHeader>
  )
}
