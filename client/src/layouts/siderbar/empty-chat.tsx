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
import { APP_PAGES } from '@/constants/link.const'
import { MessageCircleDashed, UserPlus } from 'lucide-react'
import { Link } from 'react-router'

export function EmptyChat() {
  return (
    <SidebarGroup>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant='icon' className='size-14'>
            <MessageCircleDashed className='size-10' />
          </EmptyMedia>
          <EmptyTitle>Chưa có tin nhắn nào</EmptyTitle>
          <EmptyDescription>Bắt đầu cuộc trò chuyện mới!</EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button size={'lg'} className='w-full' asChild>
            <Link to={APP_PAGES.ADD_FRIENDS}>
              <UserPlus /> Tìm kiếm bạn bè
            </Link>
          </Button>
        </EmptyContent>
      </Empty>
    </SidebarGroup>
  )
}
