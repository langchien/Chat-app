import { ChatAvatar } from '@/components/avatar'
import { PageHeader } from '@/components/header/page-header'
import { Button } from '@/components/ui/button'
import { useChatName } from '@/hooks/use-chat-name'
import type { IChat, IMedia } from '@/types/api.types'
import { Phone, Video } from 'lucide-react'
import type { IChatLink } from '../services/chat.res.dto'
import { ChatInfo } from './chat-info'

interface ChatHeaderProps {
  chat: IChat
  linksPromise: Promise<IChatLink[]>
  mediaPromise: Promise<IMedia[]>
}

export function ChatHeader({ chat, linksPromise, mediaPromise }: ChatHeaderProps) {
  const { chatDisplayName } = useChatName(chat)
  return (
    <PageHeader>
      <div className='rounded-none h-full shadow-none flex flex-row items-center justify-between'>
        <div className='flex flex-row items-center space-x-3'>
          <ChatAvatar chatItem={chat} size='sm' />
          <h2 className='font-bold text-lg min-w-0 line-clamp-1'>{chatDisplayName}</h2>
        </div>
        <div className='flex gap-2'>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <Phone className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <Video className='h-5 w-5' />
          </Button>
          <ChatInfo chat={chat} linksPromise={linksPromise} mediaPromise={mediaPromise} />
        </div>
      </div>
    </PageHeader>
  )
}
