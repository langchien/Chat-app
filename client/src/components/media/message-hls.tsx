import type { IMedia } from '@/services/api.types'
import { Clock } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import { StreamVideoHLS } from './hls-stream'

export function MessageVideoHls({ hlsVideos }: { hlsVideos: IMedia[] }) {
  const video = hlsVideos[0]
  if (video.status !== 'compileted') {
    return (
      <div className='relative h-56 w-96 max-w-full overflow-hidden rounded-md'>
        <Skeleton className='h-full w-full bg-gray-200 dark:bg-gray-700' />
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white'>
          <Clock className='h-12 w-12' />
          <p className='mt-2 text-sm font-medium flex  gap-2'>Đang xử lý video ...</p>
        </div>
      </div>
    )
  }

  return <StreamVideoHLS className='h-56' src={video.url} />
}
