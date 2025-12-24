import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { MessageCircleDashed } from 'lucide-react'
import { Button } from '../ui/button'
import { SidebarGroup } from '../ui/sidebar'

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
