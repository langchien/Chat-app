import type { IChat } from '@/services/api.types'
import { Users } from 'lucide-react'
import { SidebarGroup, SidebarGroupLabel } from '../ui/sidebar'
import { ChatCard } from './chat-card'

interface SidebarGroupChatProps {
  chatGroups: IChat[]
  activeChatId?: string
  userId?: string
}

export function SidebarGroupChat({ chatGroups, activeChatId, userId }: SidebarGroupChatProps) {
  if (chatGroups.length === 0) return null
  return (
    <SidebarGroup className='space-y-2'>
      <SidebarGroupLabel className='text-base flex justify-between items-center'>
        Nhóm
        <Users className='size-12' />
      </SidebarGroupLabel>
      {chatGroups.map((chatItem) => (
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
