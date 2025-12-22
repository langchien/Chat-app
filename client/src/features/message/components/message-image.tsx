import type { IMedia } from '@/types/api.types'

export function MessageImages({ images }: { images: IMedia[] }) {
  return (
    <div className='mt-2 flex flex-wrap gap-1 p-1 rounded-2xl bg-gray-100'>
      {images.map((media) => (
        <img
          key={media.id}
          src={media.url}
          alt='message media'
          className='flex-1 basis-32 max-h-32 min-w-0 aspect-square object-cover rounded-md'
        />
      ))}
    </div>
  )
}
