import { AppHeader } from '@/components/header'
import {
  Sidebar,
  SidebarFooter,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar'
import type { IChatPaginateCursorResDto } from '@/features/chat/services'
import { ChatList } from '@/layouts/siderbar/chat-list'
import { Outlet } from 'react-router'
import { MainNav } from '../main-nav'
import { AccountSetting } from './account-setting'
import { CreateChatModal } from './create-chat-modal'
import { SidebarNav } from './sidebar-nav'

export function ChatSidebar({ paginateData }: { paginateData: IChatPaginateCursorResDto }) {
  return (
    <div className='bg-sidebar h-screen flex flex-col'>
      <AppHeader />
      <div className='flex flex-row flex-1 overflow-hidden shrink-0'>
        <MainNav />
        <SidebarProvider className='h-full min-h-0'>
          <Sidebar
            variant='sidebar'
            className='pb-16 relative border rounded-tl-lg overflow-hidden h-full flex-1  flex flex-col'
          >
            <CreateChatModal />
            <SidebarNav />
            <SidebarSeparator />
            <ChatList paginateData={paginateData} />
            <SidebarFooter className='h-16 absolute left-4 right-4 bottom-4 rounded-lg shadow-2xl border-primary border bg-white dark:bg-background'>
              <AccountSetting />
            </SidebarFooter>
          </Sidebar>
          <SidebarInset className='relative bg-background border-t'>
            <Outlet />
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}
