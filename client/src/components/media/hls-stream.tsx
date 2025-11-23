import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react'
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr'
import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/plyr/theme.css'

export function MediaHlsStream({
  className,
  src,
  poster,
  width,
  height,
}: {
  className?: string
  src: string
  poster?: string
  width?: number
  height?: number
}) {
  return (
    <MediaPlayer className={className} aspectRatio='16/9' title='Sprite Fight' src={src}>
      <MediaProvider>
        {poster && (
          <Poster asChild>
            <img src={poster} width={width} height={height} alt='A description of my image.' />
          </Poster>
        )}
      </MediaProvider>
      <PlyrLayout icons={plyrLayoutIcons} />
    </MediaPlayer>
  )
}

/**
 * @description Component dùng để stream video bình thường (không phải HLS)
 * @description Hiện tại chỉ cho phép định dạng mp4 và webm
 */
export function MediaStreamDefault({
  width,
  height,
  className,
  src,
}: {
  width?: number
  height?: number
  className?: string
  src: string
}) {
  return (
    <video controls width={width} height={height} className={className}>
      <source src={src} type='video/mp4' />
    </video>
  )
}
