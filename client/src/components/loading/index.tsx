import { useAppStore } from '@/stores/app.store'
import { MessageCircle, Phone, Send, Video } from 'lucide-react'

export function AppLoadingOverlay({ loading }: { loading?: boolean }) {
  const { isLoading } = useAppStore()
  if (!isLoading && !loading) return null
  const message = 'Đang tải, vui lòng chờ...'
  return (
    <div className='fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm'>
      {/* Icon chat */}
      <div className='absolute top-12 left-12 animate-bounce'>
        <div className='flex items-center gap-2'>
          <div className='size-20 rounded-full bg-blue-500 flex items-center justify-center'>
            <MessageCircle className='size-10 text-white' />
          </div>
        </div>
      </div>

      {/* Send icon */}
      <div className='absolute top-1/4 right-16 animate-pulse'>
        <Send className='size-10 text-blue-400' />
      </div>

      {/* Phone icon */}
      <div
        className='absolute bottom-1/4 left-1/4 animate-bounce'
        style={{ animationDelay: '0.2s' }}
      >
        <Phone className='size-10 text-indigo-400' />
      </div>

      {/* Video icon */}
      <div
        className='absolute bottom-1/3 right-1/4 animate-pulse'
        style={{ animationDelay: '0.5s' }}
      >
        <Video className='size-10 text-purple-400' />
      </div>

      {/* Main loading content */}
      <div className='relative z-10 flex flex-col items-center gap-4'>
        {/* Animated loader circle */}
        <div className='relative size-24'>
          <div className='absolute inset-0 rounded-full border-4 border-blue-500/30'></div>
          <div className='absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 border-r-indigo-500 animate-spin'></div>

          {/* Chat bubble icon in center */}
          <div className='absolute inset-0 flex items-center justify-center'>
            <MessageCircle className='size-14 text-blue-500' />
          </div>
        </div>

        {/* Loading message */}
        <p className='text-3xl font-medium text-white'>{message}</p>

        {/* Animated dots */}
        <div className='flex gap-1'>
          <div className='h-2 w-2 rounded-full bg-blue-400 animate-bounce'></div>
          <div
            className='h-2 w-2 rounded-full bg-indigo-400 animate-bounce'
            style={{ animationDelay: '0.1s' }}
          ></div>
          <div
            className='h-2 w-2 rounded-full bg-purple-400 animate-bounce'
            style={{ animationDelay: '0.2s' }}
          ></div>
        </div>
      </div>

      {/* Bubbles background */}
      <div
        className='absolute bottom-12 right-12 animate-bounce'
        style={{ animationDelay: '0.3s' }}
      >
        <div className='flex flex-col gap-2'>
          <div className='h-8 w-20 rounded-2xl rounded-bl-none bg-blue-500/30'></div>
          <div className='h-8 w-24 rounded-2xl rounded-bl-none bg-indigo-500/30 ml-4'></div>
        </div>
      </div>
    </div>
  )
}
