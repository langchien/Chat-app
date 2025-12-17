import { Button } from '@/components/ui/button'
import { APP_PAGES } from '@/constants/link.const'
import { useAuthStore } from '@/stores/auth.store'
import { MessageSquare, Shield, Video, Zap } from 'lucide-react'
import { Link } from 'react-router'

export function meta() {
  return [{ title: 'Chat app' }, { name: 'description', content: 'Welcome to Chat app!' }]
}
export default function Welcome() {
  const { user } = useAuthStore()
  return (
    <main className='min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950'>
      <div className='container mx-auto px-4 py-16'>
        {/* Hero Section */}
        <header className='text-center mb-20 pt-12'>
          <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6'>
            <Zap className='w-4 h-4 text-blue-400' />
            <span className='text-sm text-blue-400 font-medium'>Kết nối mọi lúc, mọi nơi</span>
          </div>

          <h1 className='text-5xl md:text-7xl font-bold text-white mb-6 text-balance'>
            Trò chuyện và gọi video
            <span className='block text-transparent bg-clip-text bg-linear-to-brfrom-blue-400 to-purple-400'>
              trong thời gian thực
            </span>
          </h1>

          <p className='text-xl text-slate-400 max-w-2xl mx-auto mb-10 text-pretty leading-relaxed'>
            Ứng dụng chat hiện đại với tin nhắn tức thời và cuộc gọi video chất lượng cao. Kết nối
            với bạn bè và đồng nghiệp một cách dễ dàng.
          </p>

          <div className='flex flex-wrap items-center justify-center gap-4'>
            {user ? (
              <Link to={APP_PAGES.CHAT}>
                <Button className='h-16 text-xl px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/25'>
                  Chat ngay
                </Button>
              </Link>
            ) : (
              <>
                <Link to={APP_PAGES.SIGNUP}>
                  <Button className='h-16 text-xl px-8 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/25'>
                    Đăng ký ngay
                  </Button>
                </Link>
                <Link to={APP_PAGES.SIGNIN}>
                  <Button className='h-16 text-xl px-8 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition-colors border border-slate-700'>
                    Đăng nhập
                  </Button>
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Features Grid */}
        <div className='grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-20'>
          {/* Real-time Chat Feature */}
          <div className='group relative bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300'>
            <div className='absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity' />

            <div className='relative'>
              <div className='w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                <MessageSquare className='w-7 h-7 text-blue-400' />
              </div>

              <h3 className='text-2xl font-bold text-white mb-4'>Chat Real-time</h3>

              <p className='text-slate-400 leading-relaxed mb-6'>
                Gửi và nhận tin nhắn tức thời với độ trễ cực thấp. Hỗ trợ văn bản, emoji, hình ảnh
                và file đính kèm.
              </p>

              <ul className='space-y-3'>
                <li className='flex items-center gap-3 text-slate-300'>
                  <div className='w-1.5 h-1.5 rounded-full bg-blue-400' />
                  <span>Tin nhắn tức thời</span>
                </li>
                <li className='flex items-center gap-3 text-slate-300'>
                  <div className='w-1.5 h-1.5 rounded-full bg-blue-400' />
                  <span>Chia sẻ file và media</span>
                </li>
                <li className='flex items-center gap-3 text-slate-300'>
                  <div className='w-1.5 h-1.5 rounded-full bg-blue-400' />
                  <span>Nhóm chat không giới hạn</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Video Calling Feature */}
          <div className='group relative bg-linear-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300'>
            <div className='absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity' />

            <div className='relative'>
              <div className='w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform'>
                <Video className='w-7 h-7 text-purple-400' />
              </div>

              <h3 className='text-2xl font-bold text-white mb-4'>Gọi Video Trực Tuyến</h3>

              <p className='text-slate-400 leading-relaxed mb-6'>
                Cuộc gọi video HD với chất lượng ổn định. Hỗ trợ gọi 1-1 và gọi nhóm với nhiều người
                tham gia.
              </p>

              <ul className='space-y-3'>
                <li className='flex items-center gap-3 text-slate-300'>
                  <div className='w-1.5 h-1.5 rounded-full bg-purple-400' />
                  <span>Video HD chất lượng cao</span>
                </li>
                <li className='flex items-center gap-3 text-slate-300'>
                  <div className='w-1.5 h-1.5 rounded-full bg-purple-400' />
                  <span>Gọi nhóm đa người</span>
                </li>
                <li className='flex items-center gap-3 text-slate-300'>
                  <div className='w-1.5 h-1.5 rounded-full bg-purple-400' />
                  <span>Chia sẻ màn hình</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        <div className='max-w-5xl mx-auto'>
          <h2 className='text-3xl font-bold text-white text-center mb-12'>
            Tính năng nổi bật khác
          </h2>

          <div className='grid md:grid-cols-3 gap-6'>
            <div className='bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center'>
              <div className='w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <Zap className='w-6 h-6 text-green-400' />
              </div>
              <h4 className='text-lg font-semibold text-white mb-2'>Siêu nhanh</h4>
              <p className='text-slate-400 text-sm leading-relaxed'>
                Tối ưu hiệu suất, trải nghiệm mượt mà
              </p>
            </div>

            <div className='bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center'>
              <div className='w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <Shield className='w-6 h-6 text-blue-400' />
              </div>
              <h4 className='text-lg font-semibold text-white mb-2'>Bảo mật</h4>
              <p className='text-slate-400 text-sm leading-relaxed'>
                Mã hóa end-to-end, dữ liệu an toàn
              </p>
            </div>

            <div className='bg-slate-900/50 border border-slate-800 rounded-xl p-6 text-center'>
              <div className='w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mx-auto mb-4'>
                <MessageSquare className='w-6 h-6 text-purple-400' />
              </div>
              <h4 className='text-lg font-semibold text-white mb-2'>Đa nền tảng</h4>
              <p className='text-slate-400 text-sm leading-relaxed'>
                Sử dụng trên web, mobile và desktop
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
