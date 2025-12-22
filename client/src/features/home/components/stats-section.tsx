import { Lock, ShieldCheck, Zap } from 'lucide-react'

const STATS = [
  {
    icon: Zap,
    value: '< 50ms',
    label: 'Độ trễ toàn cầu',
  },
  {
    icon: ShieldCheck,
    value: '99.9%',
    label: 'Cam kết hoạt động',
  },
  {
    icon: Lock,
    value: 'Đầu cuối',
    label: 'Tiêu chuẩn mã hóa',
  },
]

export function StatsSection() {
  return (
    <section className='py-12 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 border-y border-border-dark'>
      <div className='max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {STATS.map((stat, index) => (
            <div
              key={index}
              className='flex flex-col items-center text-center p-6 rounded-2xl bg-surface-dark border border-border-dark/50 hover:border-primary/30 transition-colors'
            >
              <stat.icon className='w-10 h-10 text-primary mb-4' />
              <p className='text-3xl font-bold text-white mb-1'>{stat.value}</p>
              <p className='text-gray-400 font-medium'>{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
