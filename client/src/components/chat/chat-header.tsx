import { useChatName } from '@/hooks/use-chat-name'
import type { IChat } from '@/services/api.types'
import { Phone, Video } from 'lucide-react'
import { ChatAvatar } from '../siderbar/chat-avatar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { ChatInfo } from './chat-info'

export function ChatHeader({ chat }: { chat: IChat }) {
  const { chatDisplayName } = useChatName(chat)
  return (
    <Card className='sticky top-0 z-10 rounded-none shadow-none p-4 flex flex-row items-center justify-between bg-card '>
      <div className='flex flex-row items-center space-x-3'>
        <ChatAvatar chatItem={chat} />
        <h2 className='font-bold text-lg min-w-0 line-clamp-1'>{chatDisplayName}</h2>
      </div>
      <div className='flex gap-2'>
        <Button variant='ghost' size='icon' className='h-9 w-9'>
          <Phone className='h-5 w-5' />
        </Button>
        <Button variant='ghost' size='icon' className='h-9 w-9'>
          <Video className='h-5 w-5' />
        </Button>
        <ChatInfo chat={chat} />
      </div>
    </Card>
  )
}
