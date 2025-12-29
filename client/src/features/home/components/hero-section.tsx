import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { APP_PAGES } from '@/constants/link.const'
import type { IUser } from '@/types/api.types'
import { CheckCircle, MicOff, MonitorUp, PhoneOff, Video } from 'lucide-react'
import { Link } from 'react-router'

const AVATARS = [
  'https://lang-tien-aws-s3-chat-app.s3.ap-southeast-1.amazonaws.com/avatar/avatar+(1).jpg',
  'https://lang-tien-aws-s3-chat-app.s3.ap-southeast-1.amazonaws.com/avatar/avatar+(2).jpg',
  'https://lang-tien-aws-s3-chat-app.s3.ap-southeast-1.amazonaws.com/avatar/avatar+(3).jpg',
]

interface HeroSectionProps {
  user: IUser | null
}

export function HeroSection({ user }: HeroSectionProps) {
  return (
    <section className='relative pt-16 pb-20 lg:pt-24 lg:pb-32 overflow-hidden'>
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>
          {/* <!-- Hero Content --> */}
          <div className='flex flex-col items-center lg:items-start text-center lg:text-left flex-1 max-w-2xl'>
            <h1 className='text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight mb-6 text-destructive dark:text-white'>
              Chat, Gọi &amp; Stream <br />
              <span className='text-primary'>Tất cả trong một nền tảng</span>
            </h1>
            <p className='text-lg sm:text-xl text-gray-400 mb-8 max-w-lg leading-relaxed'>
              Trải nghiệm giao tiếp độ trễ thấp không giới hạn. Kết nối với nhóm của bạn ngay lập
              tức qua giọng nói chất lượng cao, video và streaming.
            </p>
            <div className='flex flex-col sm:flex-row gap-4 w-full sm:w-auto'>
              {user ? (
                <Link to={APP_PAGES.CHAT}>
                  <Button className='w-full sm:w-auto h-16 text-xl px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/25'>
                    Chat ngay
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to={APP_PAGES.SIGNUP}>
                    <Button className='w-full sm:w-auto h-16 text-xl px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/25'>
                      Đăng ký ngay
                    </Button>
                  </Link>
                  <Link to={APP_PAGES.SIGNIN}>
                    <Button className='w-full sm:w-auto h-16 text-xl px-8 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors border border-slate-700 hover:text-white'>
                      Đăng nhập
                    </Button>
                  </Link>
                </>
              )}
            </div>
            <div className='mt-8 flex items-center gap-4 text-sm text-gray-500'>
              <div className='flex -space-x-2'>
                {AVATARS.map((avatar, index) => (
                  <Avatar key={index} className='w-8 h-8 border-2 border-[#111418]'>
                    <AvatarImage
                      src={avatar}
                      alt={`User avatar ${index + 1}`}
                      className='object-cover'
                    />
                    <AvatarFallback className='bg-gray-700' />
                  </Avatar>
                ))}
              </div>
              <p>Được tin dùng bởi hơn 10,000 đội ngũ</p>
            </div>
          </div>
          {/* <!-- Hero Visual --> */}
          <div className='flex-1 w-full max-w-[600px] lg:max-w-none relative'>
            {/* <!-- Decorative glow --> */}
            <div className='absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-30'></div>
            <div className='relative bg-surface-dark border border-border-dark rounded-xl shadow-2xl overflow-hidden aspect-4/3 group'>
              {/* <!-- Mockup Header --> */}
              <div className='h-10 border-b border-border-dark flex items-center px-4 gap-2 bg-[#161b22]'>
                <div className='w-3 h-3 rounded-full bg-red-500/80'></div>
                <div className='w-3 h-3 rounded-full bg-yellow-500/80'></div>
                <div className='w-3 h-3 rounded-full bg-green-500/80'></div>
              </div>
              {/* <!-- Mockup Body Image --> */}
              <div
                className='w-full h-full bg-cover bg-center'
                data-alt='Dashboard interface showing video call grid and chat panel'
                style={{
                  backgroundImage: `url(${AVATARS[0]})`,
                }}
              >
                <div className='absolute inset-0 bg-linear-to-t from-surface-dark/90 to-transparent flex items-end justify-center pb-8'>
                  <div className='bg-black/40 backdrop-blur-md border border-white/10 px-6 py-3 rounded-full flex gap-6 text-white shadow-xl'>
                    <MicOff className='cursor-pointer hover:text-primary transition-colors' />
                    <Video className='cursor-pointer hover:text-primary transition-colors' />
                    <PhoneOff className='cursor-pointer text-red-500 hover:text-red-400 transition-colors' />
                    <MonitorUp className='cursor-pointer hover:text-primary transition-colors' />
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Floating Element 1 --> */}
            <div
              className='absolute -bottom-6 -left-6 sm:left-[-20px] bg-surface-dark p-4 rounded-lg border border-border-dark shadow-xl flex items-center gap-3 animate-bounce'
              style={{ animationDuration: '3s' }}
            >
              <div className='p-2 bg-green-500/20 rounded-full text-green-400'>
                <CheckCircle className='text-xl' />
              </div>
              <div>
                <p className='text-xs text-gray-400'>Độ trễ</p>
                <p className='text-sm font-bold dark:text-white'>24ms (Tuyệt vời)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
