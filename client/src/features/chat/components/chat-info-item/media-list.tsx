import type { IMedia } from '@/types/api.types'
import { Film, VideoIcon } from 'lucide-react'
import { use } from 'react'

export function MediaList({
  mediaPromise,
  type,
  onMediaClick,
}: {
  mediaPromise: Promise<IMedia[]>
  type: 'image' | 'video' | 'video_hls'
  onMediaClick: (media: IMedia) => void
}) {
  const allMedia = use(mediaPromise)
  const media = allMedia.filter((m) => {
    if (type === 'image') return m.type === 'image'
    if (type === 'video') return m.type === 'video'
    if (type === 'video_hls') return m.type === 'video_hls'
    return false
  })

  if (media.length === 0) {
    let label = 'ảnh'
    if (type === 'video') label = 'video'
    if (type === 'video_hls') label = 'phim'
    return (
      <div className='text-sm text-center text-muted-foreground py-2'>
        Acknowledgement: Không có {label} nào
      </div>
    )
  }

  return (
    <div className='grid grid-cols-3 gap-2'>
      {media.map((item) => (
        <div
          key={item.id}
          className='relative aspect-square bg-muted rounded overflow-hidden cursor-pointer hover:opacity-90'
          onClick={() => onMediaClick(item)}
        >
          {type === 'image' ? (
            <img src={item.url} alt='media' className='object-cover w-full h-full' />
          ) : (
            <div className='relative w-full h-full bg-black flex items-center justify-center'>
              {type === 'video' ? (
                <>
                  <video
                    src={item.url}
                    className='object-cover w-full h-full'
                    muted
                    preload='metadata'
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                    <VideoIcon className='text-white w-8 h-8 opacity-70' />
                  </div>
                </>
              ) : (
                <Film className='text-white w-8 h-8 opacity-70' />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
