import { Button } from '@/components/ui/button'
import type { IMedia } from '@/types/api.types'
import { Film } from 'lucide-react'
import { use } from 'react'

export function HlsMediaList({
  mediaPromise,
  onMediaClick,
}: {
  mediaPromise: Promise<IMedia[]>
  onMediaClick: (media: IMedia) => void
}) {
  const allMedia = use(mediaPromise)
  const media = allMedia.filter((m) => m.type === 'video_hls')

  if (media.length === 0) {
    return (
      <div className='text-sm text-center text-muted-foreground py-2'>
        Acknowledgement: Không có phim nào
      </div>
    )
  }

  return (
    <div className='flex justify-center'>
      <Button variant='outline' className='w-full' onClick={() => onMediaClick(media[0])}>
        <Film className='mr-2 h-4 w-4' />
        Xem tất cả ({media.length})
      </Button>
    </div>
  )
}
