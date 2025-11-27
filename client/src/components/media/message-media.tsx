import type { IMedia } from '@/services/api.types'
import { MessageFile } from './message-file'
import { MessageVideoHls } from './message-hls'
import { MessageImages } from './message-image'
import { MessageVideo } from './message-video'

export function MessageMedia({ medias }: { medias: IMedia[] }) {
  const mediaType = medias[0]?.type
  if (mediaType === 'image') return <MessageImages medias={medias} />
  if (mediaType === 'video') return <MessageVideo medias={medias} />
  if (mediaType === 'video_hls') return <MessageVideoHls medias={medias} />
  if (mediaType === 'file') return <MessageFile medias={medias} />
  return null
}
