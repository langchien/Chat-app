import { ModeToggle } from '@/components/theme/mode-toggle'
import { Button } from '@/components/ui/button'
import { WebLogo } from '@/components/web-logo'
import { APP_PAGES } from '@/constants/link.const'
import type { IUser } from '@/types/api.types'
import { Link } from 'react-router'

interface HomeHeaderProps {
  user: IUser | null
}

export function HomeHeader({ user }: HomeHeaderProps) {
  return (
    <header className='sticky top-0 z-50 w-full backdrop-blur-md bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-white border-b border-border-dark'>
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo & Brand */}
          <div className='flex items-center gap-3'>
            <WebLogo />
          </div>
          {/* Desktop Nav */}
          <nav className='hidden md:flex items-center gap-8'>
            <Link className='text-sm hover:text-primary transition-colors' to='#features'>
              Tính năng
            </Link>
            <Link className='text-sm hover:text-primary transition-colors' to='#how-it-works'>
              Cách hoạt động
            </Link>
            {user ? (
              <Link className='text-sm hover:text-primary transition-colors' to={APP_PAGES.CHAT}>
                Vào Chat
              </Link>
            ) : (
              <Link className='text-sm hover:text-primary transition-colors' to={APP_PAGES.SIGNIN}>
                Đăng nhập
              </Link>
            )}
          </nav>
          {/* <!-- CTA --> */}
          <div className='flex items-center gap-4'>
            <ModeToggle />
            {!user && (
              <>
                <Link
                  className='hidden sm:flex text-sm font-medium text-gray-300 hover:text-white transition-colors md:hidden'
                  to={APP_PAGES.SIGNIN}
                >
                  Đăng nhập
                </Link>
                <Link to={APP_PAGES.SIGNUP}>
                  <Button>Đăng ký</Button>
                </Link>
              </>
            )}
            {user && (
              <Link to={APP_PAGES.CHAT}>
                <Button>Chat ngay</Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
