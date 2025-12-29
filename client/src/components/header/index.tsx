import { ModeToggle } from '@/components/theme/mode-toggle'
import { SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar'
import { APP_PAGES } from '@/constants/link.const'
import {
  CircleQuestionMark,
  Home,
  Maximize,
  MessageCircle,
  Minimize,
  Users,
  type LucideProps,
} from 'lucide-react'
import type { ForwardRefExoticComponent, RefAttributes } from 'react'
import { Link } from 'react-router'
import { Button } from '../ui/button'
import { WebLogo } from '../web-logo'
import { AppNotification } from './app-notification'
import { useHeader } from './use-header'

const titleMap: Record<
  string,
  {
    title: string
    icon: ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>
  }
> = {
  [APP_PAGES.CHAT]: {
    title: 'Trò chuyện',
    icon: MessageCircle,
  },
  [APP_PAGES.FRIENDS]: {
    title: 'Bạn bè',
    icon: Users,
  },
  default: {
    title: 'Chào mừng đến với Hust Cha',
    icon: Home,
  },
}

const getItem = (pathname: string) => {
  //  prefix đúng là được
  const prefix = Object.keys(titleMap).find((key) => pathname.startsWith(key))
  if (!prefix) return titleMap.default
  return titleMap[prefix]
}

function AppTitle({ pathname }: { pathname: string }) {
  const item = getItem(pathname)
  return (
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2'>
      <item.icon className='size-4' />
      <span className='text-sm font-medium'>{item.title}</span>
    </div>
  )
}

export function AppHeader() {
  const { isFullscreen, toggleFullscreen, pathname } = useHeader()

  return (
    <header className='relative h-10 shrink-0 bg-sidebar w-full flex items-center px-3 overflow-hidden'>
      <SidebarMenu className='w-full'>
        <SidebarMenuItem className='flex items-center space-x-2 w-full'>
          <WebLogo />
          <div className='ms-auto' />
          {/* Thông báo */}
          <Button size='icon-sm' variant='ghost' asChild>
            <Link to={APP_PAGES.WELCOME}>
              <Home />
            </Link>
          </Button>
          <AppNotification />
          <ModeToggle />
          <Button size='icon-sm' variant='ghost'>
            <CircleQuestionMark />
          </Button>
          <div className='flex items-center gap-1 border-s ps-1'>
            <Button size='icon-sm' variant='ghost' onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize /> : <Maximize />}
            </Button>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
      <AppTitle pathname={pathname} />
    </header>
  )
}
