import type { IChat } from '@/services/api.types'
import { UserPlus } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel } from '../ui/sidebar'
import { ChatCard } from './chat-card'

interface SidebarDirectChatProps {
  chatDirects: IChat[]
  activeChatId?: string
  userId?: string
}

export function SidebarDirectChat({ chatDirects, activeChatId, userId }: SidebarDirectChatProps) {
  if (chatDirects.length === 0) return null
  return (
    <SidebarGroup className='space-y-2'>
      <SidebarGroupLabel className='text-base flex justify-between items-center'>
        Bạn bè
        <UserPlus className='size-12' />
      </SidebarGroupLabel>
      {chatDirects.map((chatItem) => (
        <ChatCard
          key={chatItem.id}
          chatItem={chatItem}
          activeChatId={activeChatId}
          userId={userId}
        />
      ))}
    </SidebarGroup>
  )
}
