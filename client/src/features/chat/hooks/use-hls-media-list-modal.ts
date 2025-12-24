import { use, useCallback, useEffect, useMemo } from 'react'
import { useLoaderData } from 'react-router'
import type { clientLoader } from '../pages/chat'

export function useHlsMediaListModal(
  mediaId: string | null,
  setMediaId: (mediaId: string | null) => void,
) {
  const open = Boolean(mediaId)
  const { mediaPromise } = useLoaderData<typeof clientLoader>()
  const initialMediaList = use(mediaPromise)

  const mediaList = useMemo(() => {
    return initialMediaList.filter((media) => media.type === 'video_hls')
  }, [initialMediaList])

  const currentMediaIndex = useMemo(() => {
    return mediaList.findIndex((m) => m.id === mediaId)
  }, [mediaList, mediaId])

  const currentMedia = mediaList[currentMediaIndex]

  const onOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setMediaId(null)
    }
  }

  const handleNext = useCallback(() => {
    if (currentMediaIndex < mediaList.length - 1) {
      const nextMedia = mediaList[currentMediaIndex + 1]
      setMediaId(nextMedia.id)
    }
  }, [currentMediaIndex, mediaList, setMediaId])

  const handlePrev = useCallback(() => {
    if (currentMediaIndex > 0) {
      const prevMedia = mediaList[currentMediaIndex - 1]
      setMediaId(prevMedia.id)
    }
  }, [currentMediaIndex, mediaList, setMediaId])

  const handleSelectMedia = useCallback(
    (id: string) => {
      setMediaId(id)
    },
    [setMediaId],
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return
      if (e.key === 'ArrowRight') handleNext()
      if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, currentMediaIndex, mediaList, handleNext, handlePrev])

  return {
    open,
    mediaList,
    currentMedia,
    currentMediaIndex,
    onOpenChange,
    handleNext,
    handlePrev,
    handleSelectMedia,
  }
}
