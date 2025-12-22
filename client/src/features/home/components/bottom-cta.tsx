import { Button } from '@/components/ui/button'
import { APP_PAGES } from '@/constants/link.const'
import type { IUser } from '@/types/api.types'
import { Link } from 'react-router'

export function BottomCTA({ user }: { user: IUser | null }) {
  return (
    <section className='py-20 lg:py-28 relative overflow-hidden'>
      <div className='absolute inset-0 bg-primary/5'></div>
      <div className='max-w-4xl mx-auto px-4 relative z-10 text-center'>
        <h2 className='text-4xl sm:text-5xl font-black mb-6'>
          Bắt đầu trò chuyện với nhóm của bạn ngay hôm nay
        </h2>
        <p className='text-xl text-gray-400 mb-10'>
          Tham gia cùng hàng ngàn đội ngũ tin tưởng ChatApp cho nhu cầu giao tiếp hàng ngày.
        </p>
        <div className='flex flex-col sm:flex-row justify-center gap-4'>
          {user ? (
            <Link to={APP_PAGES.CHAT}>
              <Button className='h-14 px-10 rounded-lg bg-primary font-bold text-lg shadow-xl shadow-primary/25 hover:bg-blue-600 transition-all transform hover:scale-105'>
                Chat ngay
              </Button>
            </Link>
          ) : (
            <>
              <Link to={APP_PAGES.SIGNUP}>
                <Button className='h-14 px-10 rounded-lg bg-primary font-bold text-lg shadow-xl shadow-primary/25 hover:bg-blue-600 transition-all transform hover:scale-105'>
                  Đăng ký miễn phí
                </Button>
              </Link>
              <Link to='#'>
                <Button
                  variant='outline'
                  className='h-14 px-10 rounded-lg bg-surface-dark border border-border-dark font-bold text-lg hover:bg-[#283039] transition-all hover:text-white'
                >
                  Liên hệ kinh doanh
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
