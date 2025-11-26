import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'
import { APP_IMAGES, APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/hooks/stores/auth.store'
import { getInitials } from '@/lib/utils'
import type { IUser } from '@/services/api.types'
import { BadgeCheck, Bell, ChevronsUpDown, Computer, Layers, LogOut } from 'lucide-react'
import { Link } from 'react-router'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'

export function UserInfo({ user }: { user: IUser }) {
  return (
    <div className='flex items-center gap-2 px-1 py-1.5 text-left text-sm'>
      <Avatar className='h-12 w-12'>
        <AvatarImage src={user.avatarUrl ?? APP_IMAGES.AVATAR_DEFAULT} alt={user.displayName} />
        <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
      </Avatar>
      <div className='grid flex-1 text-left text-sm leading-tight'>
        <span className='truncate font-semibold capitalize'>{user.displayName}</span>
        <span className='truncate text-xs'>{user.email}</span>
      </div>
    </div>
  )
}

export function AccountSetting() {
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)
  const { isMobile } = useSidebar()
  if (!user)
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <Link to={APP_PAGES.SIGNIN}>
            <Button className='w-full'>Đăng nhập</Button>
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    )
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size='lg'>
              <UserInfo user={user} />
              <ChevronsUpDown className='ml-auto size-4' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg'
            side={isMobile ? 'bottom' : 'right'}
            align='end'
            sideOffset={4}
          >
            <DropdownMenuLabel className='p-0 font-normal'>
              <UserInfo user={user} />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <BadgeCheck />
                Tài khoản
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Bell />
                Thông báo
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Layers />
                Đổi mật khẩu
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Computer />
                Thiết bị đăng nhập
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
              <LogOut />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
