import { MessageSquare, Share2, UserPlus, Users } from 'lucide-react'

const STEPS = [
  {
    icon: UserPlus,
    title: '1. Tạo tài khoản',
    description: 'Đăng ký miễn phí bằng email hoặc đăng nhập xã hội.',
  },
  {
    icon: Users,
    title: '2. Kết nối bạn bè',
    description: 'Mời thành viên nhóm hoặc bạn bè qua liên kết.',
  },
  {
    icon: MessageSquare,
    title: '3. Chat & Gọi',
    description: 'Bắt đầu cuộc trò chuyện ngay lập tức với thoại và video HD.',
  },
  {
    icon: Share2,
    title: '4. Chia sẻ tệp',
    description: 'Cộng tác bằng cách chia sẻ tệp trực tiếp trong cuộc trò chuyện.',
  },
]

export function HowItWorksSection() {
  return (
    <section
      className='py-20 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 border-y border-border-dark'
      id='how-it-works'
    >
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='text-center mb-16'>
          <h2 className='text-3xl md:text-4xl font-black text-white mb-4'>Cách hoạt động</h2>
          <p className='text-lg text-gray-400'>Bắt đầu chỉ trong vài phút.</p>
        </div>
        <div className='relative'>
          {/* <!-- Connecting Line (Desktop) --> */}
          <div className='hidden md:block absolute top-12 left-0 w-full h-0.5 bg-border-dark -z-10'></div>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
            {STEPS.map((step, index) => (
              <div key={index} className='flex flex-col items-center text-center'>
                <div className='w-24 h-24 rounded-full bg-surface-dark border-4 border-[#0d1014] flex items-center justify-center mb-6 shadow-xl relative z-10'>
                  <step.icon className='w-10 h-10 text-primary' />
                </div>
                <h3 className='text-lg font-bold text-white mb-2'>{step.title}</h3>
                <p className='text-sm text-gray-400 max-w-[200px]'>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
