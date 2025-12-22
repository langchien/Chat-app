import type { IMedia } from '@/types/api.types'

export function MessageVideo({ videos }: { videos: IMedia[] }) {
  return (
    <div className='mt-2 flex flex-col space-y-2'>
      {videos.map((video) => (
        <video key={video.id} controls className='w-full max-h-56 rounded-md object-cover'>
          <source src={video.url} type='video/mp4' />
        </video>
      ))}
    </div>
  )
}
