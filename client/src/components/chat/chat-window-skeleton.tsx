import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Image, Paperclip, Send, Video } from 'lucide-react'
import { Card } from '../ui/card'

const skeletonMessages = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  isOwn: Math.random() > 0.5,
  width: Math.floor(Math.random() * 300) + 200, // Random width between 100 and 250
}))
export function ChatWindowSkeleton() {
  return (
    <>
      <div className='border-t border-border p-4 space-y-5 flex flex-col'>
        {skeletonMessages.map((message) => (
          <div key={message.id} className={cn('flex items-center', message.isOwn && 'justify-end')}>
            {!message.isOwn && <Skeleton className='h-10 w-10 rounded-full mr-3 bg-gray-300' />}
            <Skeleton
              style={{ width: `${message.width}px` }}
              className={cn('h-10 rounded-xl', message.isOwn ? 'bg-blue-500' : 'bg-gray-300')}
            />
            {message.isOwn && <Skeleton className='h-10 w-10 rounded-full ml-3 bg-gray-300' />}
          </div>
        ))}
      </div>
      <Card className='sticky bottom-0 z-10 rounded-none p-4 mt-auto'>
        <div className='flex gap-2'>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <Video className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <Image className='h-5 w-5' />
          </Button>
          <Button variant='ghost' size='icon' className='h-9 w-9'>
            <Paperclip className='h-5 w-5' />
          </Button>
          <Input placeholder='Aa' className='flex-1' />
          <Button size='icon' className='h-9 w-9 bg-blue-500 hover:bg-blue-600'>
            <Send className='h-5 w-5' />
          </Button>
        </div>
      </Card>
    </>
  )
}
