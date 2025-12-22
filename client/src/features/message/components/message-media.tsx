import type { IMedia } from '@/types/api.types'

import { MessageAudio } from './message-autio'
import { MessageFile } from './message-file'
import { MessageVideoHls } from './message-hls'
import { MessageImages } from './message-image'
import { MessageVideo } from './message-video'

export function MessageMedia({ medias }: { medias: IMedia[] }) {
  const images = medias.filter((media) => media.type === 'image')
  const videos = medias.filter((media) => media.type === 'video')
  const hlsVideos = medias.filter((media) => media.type === 'video_hls')
  const files = medias.filter((media) => media.type === 'file')
  const audios = medias.filter((media) => media.type === 'audio')
  return (
    <>
      {images.length > 0 && <MessageImages images={images} />}
      {videos.length > 0 && <MessageVideo videos={videos} />}
      {hlsVideos.length > 0 && <MessageVideoHls hlsVideos={hlsVideos} />}
      {files.length > 0 && <MessageFile files={files} />}
      {audios.length > 0 && <MessageAudio audios={audios} />}
    </>
  )
}
