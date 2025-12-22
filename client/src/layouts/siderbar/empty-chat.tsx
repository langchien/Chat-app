import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { SidebarGroup } from '@/components/ui/sidebar'
import { MessageCircleDashed } from 'lucide-react'

export function EmptyChat() {
  return (
    <SidebarGroup>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon' className='size-24'>
            <MessageCircleDashed className='size-20' />
          </EmptyMedia>
          <EmptyTitle>Chưa có tin nhắn nào</EmptyTitle>
          <EmptyDescription>
            Bắt đầu cuộc trò chuyện mới bằng cách chọn một cuộc trò chuyện hiện có hoặc tạo một cuộc
            trò chuyện mới.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className='flex gap-2'>
            <Button>Bạn bè</Button>
            <Button variant='outline'>Tham gia nhóm</Button>
          </div>
        </EmptyContent>
      </Empty>
    </SidebarGroup>
  )
}
