import { StreamVideoHLS } from '@/components/hls-stream'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useHlsMediaListModal } from '../../hooks/use-hls-media-list-modal'

interface HlsMediaListModalProps {
  mediaId: string | null
  setMediaId: (mediaId: string | null) => void
}
export function HlsMediaListModal({ mediaId, setMediaId }: HlsMediaListModalProps) {
  const { open, mediaList, currentMedia, currentMediaIndex, onOpenChange, handleNext, handlePrev } =
    useHlsMediaListModal(mediaId, setMediaId)

  if (!open || !currentMedia) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[90vw] max-w-[90vw] h-[90vh] p-0 bg-black/95 border-none flex flex-row gap-0 overflow-hidden outline-none'>
        <VisuallyHidden>
          <DialogTitle>HLS Media Viewer</DialogTitle>
          <DialogDescription>View HLS videos from the chat</DialogDescription>
        </VisuallyHidden>

        {/* Main Content Area */}
        <div className='flex-1 relative flex items-center justify-center p-4 min-w-0 bg-black'>
          {/* Top Actions */}
          <div className='absolute top-4 right-4 z-50 flex gap-2'>
            <Button
              variant='ghost'
              size='icon'
              className='text-white hover:bg-white/20 rounded-full'
              onClick={() => onOpenChange(false)}
            >
              <X className='w-6 h-6' />
            </Button>
          </div>

          {/* Previous Button */}
          {currentMediaIndex > 0 && (
            <Button
              variant='ghost'
              size='icon'
              className='absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full h-12 w-12 z-10'
              onClick={handlePrev}
            >
              <ChevronLeft className='w-8 h-8' />
            </Button>
          )}

          {/* Media Content - Using StreamVideoHLS */}
          <div className='w-full h-full flex items-center justify-center'>
            <StreamVideoHLS
              src={currentMedia.url}
              className='max-w-full max-h-full aspect-video w-full'
            />
          </div>

          {/* Next Button */}
          {currentMediaIndex < mediaList.length - 1 && (
            <Button
              variant='ghost'
              size='icon'
              className='absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/10 rounded-full h-12 w-12 z-10'
              onClick={handleNext}
            >
              <ChevronRight className='w-8 h-8' />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
