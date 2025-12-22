import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

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
    </>
  )
}
