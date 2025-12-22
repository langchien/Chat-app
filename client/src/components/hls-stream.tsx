import { MediaPlayer, MediaProvider, Poster } from '@vidstack/react'
import { PlyrLayout, plyrLayoutIcons } from '@vidstack/react/player/layouts/plyr'
import '@vidstack/react/player/styles/base.css'
import '@vidstack/react/player/styles/plyr/theme.css'

export function StreamVideoHLS({
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
