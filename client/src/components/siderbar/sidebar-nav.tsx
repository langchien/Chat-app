import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { APP_PAGES } from '@/constants/link.const'
import { Contact2 } from 'lucide-react'
import { Link } from 'react-router'

const items = [
  {
    title: 'Danh bạ',
    url: APP_PAGES.FRIENDS,
    icon: Contact2,
  },
]
export function SidebarNav() {
  return (
    <SidebarContent className='flex-none'>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton size={'lg'} asChild>
                  <Link to={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  )
}
