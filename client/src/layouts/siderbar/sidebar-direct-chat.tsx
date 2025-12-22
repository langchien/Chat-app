import { SidebarGroup, SidebarGroupLabel } from '@/components/ui/sidebar'
import type { IChat } from '@/types/api.types'
import { User } from 'lucide-react'
import { ChatCard } from './chat-card'

interface SidebarDirectChatProps {
  chatDirects: IChat[]
  activeChatId?: string
}

export function SidebarDirectChat({ chatDirects, activeChatId }: SidebarDirectChatProps) {
  if (chatDirects.length === 0) return null
  return (
    <SidebarGroup className='space-y-2'>
      <SidebarGroupLabel className='text-base flex justify-between items-center'>
        Trò chuyện trực tiếp
        <User className='size-12' />
      </SidebarGroupLabel>
      {chatDirects.map((chatItem) => (
        <ChatCard key={chatItem.id} chatItem={chatItem} activeChatId={activeChatId} />
      ))}
    </SidebarGroup>
  )
}
