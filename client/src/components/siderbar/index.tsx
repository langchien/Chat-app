import { AppTittle } from '@/components/chat/app-tittle'
import { AccountSetting } from '@/components/siderbar/account-setting'
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
      <Sidebar variant='sidebar'>
        <SidebarHeader>
          <SidebarMenu>
            <AppTittle />
            <UserSearchForm />
          </SidebarMenu>
        </SidebarHeader>
        <ChatList />
        <SidebarFooter className='h-16 mt-auto justify-center flex-col sticky bottom-0 bg-white border-t border-border'>
          <AccountSetting />
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className='overflow-x-auto overflow-y-hidden bg-neutral-50 dark:bg-background'>
        <main className='container h-screen mx-auto px-4'>
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
