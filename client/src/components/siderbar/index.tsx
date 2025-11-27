import { AccountSetting } from '@/components/siderbar/account-setting'
import { AppTittle } from '@/components/siderbar/app-tittle'
import { ChatList } from '@/components/siderbar/chat-list'
import { UserSearchForm } from '@/components/siderbar/search-form'
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarProvider,
} from '@/components/ui/sidebar'
import { Outlet } from 'react-router'

export function ChatSidebar() {
  return (
    <SidebarProvider className='overflow-hidden'>
      <Sidebar variant='sidebar' className='h-screen bg-sidebar pb-16 relative'>
        <SidebarHeader>
          <SidebarMenu>
            <AppTittle />
            <UserSearchForm />
          </SidebarMenu>
        </SidebarHeader>
        <ChatList />
        <SidebarFooter className='h-16 absolute left-4 right-4 bottom-4 rounded-lg shadow-2xl border-primary border bg-white dark:bg-background'>
          <AccountSetting />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className='overflow-x-auto overflow-y-hidden'>
        <main className='h-screen'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
