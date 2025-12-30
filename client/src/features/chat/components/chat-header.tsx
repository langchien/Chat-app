import { ChatAvatar } from '@/components/avatar'
import { PageHeader } from '@/components/header/page-header'
import { Button } from '@/components/ui/button'
import { useChatName } from '@/hooks/use-chat-name'
<<<<<<< HEAD
import { Phone } from 'lucide-react'
=======
import { Phone, Video } from 'lucide-react'
import { useState } from 'react'
>>>>>>> b1c0470b5721648655113daa71ccf5b3d571de63
import { useLoaderData } from 'react-router'
import { PrevVideoCallSetupModal } from '../../call/components/prev-video-call-seup-modal'
import type { clientLoader } from '../pages/chat'
import { ChatInfo } from './chat-info'

export function ChatHeader() {
  const { chat } = useLoaderData<typeof clientLoader>()
  const { chatDisplayName } = useChatName(chat)
<<<<<<< HEAD
=======
  const [isVideoCallModalOpen, setIsVideoCallModalOpen] = useState(false)
>>>>>>> b1c0470b5721648655113daa71ccf5b3d571de63

  return (
    <PageHeader>
      <div className='rounded-none h-full shadow-none flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center space-x-3'>
          <ChatAvatar chatItem={chat} size='sm' />
          <h2 className='font-bold text-lg min-w-0 line-clamp-1 capitalize'>{chatDisplayName}</h2>
        </div>
        <div className='flex gap-2'>
          <PrevVideoCallSetupModal
            onJoin={() => {}}
            onCancel={() => setIsVideoCallModalOpen(false)}
          />
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <Phone className='h-5 w-5' />
          </Button>
          <PrevVideoCallSetupModal onJoin={() => {}} onCancel={() => {}} />

          <ChatInfo />
        </div>
      </div>
    </PageHeader>
  )
}
