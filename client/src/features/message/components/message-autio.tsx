import type { IMedia } from '@/types/api.types'

export function MessageAudio({ audios }: { audios: IMedia[] }) {
  return (
    <div className='flex flex-col space-y-2'>
      {audios.map((audio) => (
        <audio key={audio.id} preload='auto' controls>
          <source src={audio.url} type='audio/mpeg' />
        </audio>
      ))}
    </div>
  )
}
