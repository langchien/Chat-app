import { SOCKET_EVENTS } from '@/constants/event.const'
import type { IMedia } from '@/types/api.types'

import { StreamVideoHLS } from '@/components/hls-stream'
import { Skeleton } from '@/components/ui/skeleton'
import { MediaStatus } from '@/features/message/services/media/media.schema'
import { useSocketStore } from '@/stores/socket.store'
import { Clock, Frown } from 'lucide-react'
import { useEffect, useState } from 'react'

export function MessageVideoHls({ hlsVideos }: { hlsVideos: IMedia[] }) {
  const [video, setVideo] = useState<IMedia>(hlsVideos[0])
  const socket = useSocketStore((state) => state.socket)
  useEffect(() => {
    if (!socket) return
    if (video.status === MediaStatus.completed) return

    const handleProcessingUpdate = (payload: IMedia) => {
      if (payload.id === video.id) {
        setVideo(payload)
      }
    }
    socket.on(SOCKET_EVENTS.MEDIA_PROCESSING_UPDATE, handleProcessingUpdate)

    return () => {
      socket.off(SOCKET_EVENTS.MEDIA_PROCESSING_UPDATE, handleProcessingUpdate) // Đọn dẹp sự kiện khi component unmount của commponent này
    }
  }, [socket, video.id, video.status])
  if (video.status === MediaStatus.completed)
    return <StreamVideoHLS className='h-56' src={video.url} />
  else {
    const isError = video.status === MediaStatus.failed
    const infoText = isError ? 'Đã xảy ra lỗi từ server' : 'Đang xử lý video ...'
    return (
      <div className='relative h-56 w-96 max-w-full overflow-hidden rounded-md'>
        <Skeleton className='h-full w-full bg-gray-200 dark:bg-gray-700' />
        <div className='absolute inset-0 flex flex-col items-center justify-center bg-black/30 text-white'>
          {isError ? <Frown className='size-12 text-red-500' /> : <Clock className='size-12' />}

          <p className='mt-2 text-sm font-medium flex  gap-2'>{infoText}</p>
        </div>
      </div>
    )
  }
}
