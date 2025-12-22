import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar'
import type { IChat } from '@/types/api.types'
import { Users } from 'lucide-react'
import { ChatCard } from './chat-card'

interface SidebarGroupChatProps {
  chatGroups: IChat[]
  activeChatId?: string
}

export function SidebarGroupChat({ chatGroups, activeChatId }: SidebarGroupChatProps) {
  if (chatGroups.length === 0) return null
  return (
    <SidebarGroup className='space-y-2'>
      <SidebarGroupLabel className='text-base flex justify-between items-center'>
        Nhóm
        <Users className='size-12' />
      </SidebarGroupLabel>
      {chatGroups.map((chatItem) => (
        <ChatCard key={chatItem.id} chatItem={chatItem} activeChatId={activeChatId} />
      ))}
    </SidebarGroup>
  )
}
