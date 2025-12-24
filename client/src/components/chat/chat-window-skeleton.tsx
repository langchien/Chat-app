import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { Film, Paperclip, Send } from 'lucide-react'
import { Card } from '../ui/card'
import { Label } from '../ui/label'
import { InputEmoji } from './input-imoji'

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
          <Label
            htmlFor='big-video'
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }))}
          >
            <Film className='size-5' />
          </Label>
          <Label
            htmlFor='file-input'
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon-lg' }))}
          >
            <Paperclip className='size-5' />
          </Label>
          <div className='flex-1 relative'>
            <Input placeholder='Aa' className='w-full' />
          </div>
          <InputEmoji addEmoji={() => {}} />
          <Button size='icon' className='h-9 w-9 bg-blue-500 hover:bg-blue-600'>
            <Send className='size-5' />
          </Button>
        </div>
      </Card>
    </>
  )
}
