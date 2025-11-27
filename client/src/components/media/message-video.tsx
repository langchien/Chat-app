import type { IMedia } from '@/services/api.types'

export function MessageVideo({ medias }: { medias: IMedia[] }) {
  const videos = medias.filter((media) => media.type === 'video')
  const count = videos.length
  if (count === 0) return null
  const video = videos[0]
  return (
    <div className='mt-2'>
      <video controls className='w-full max-h-56 rounded-md object-cover'>
        <source src={video.url} type='video/mp4' />
      </video>
    </div>
  )
}
