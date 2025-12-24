import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useMediaListModal } from '../../hooks/use-media-list-modal'

interface MediaListModalProps {
  mediaId: string | null
  setMediaId: (mediaId: string | null) => void
}
export function MediaListModal({ mediaId, setMediaId }: MediaListModalProps) {
  const {
    open,
    mediaList,
    currentMedia,
    currentMediaIndex,
    onOpenChange,
    handleNext,
    handlePrev,
    handleSelectMedia,
  } = useMediaListModal(mediaId, setMediaId)

  if (!open || !currentMedia) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='min-w-[90vw] max-w-[90vw] h-[90vh] p-0 bg-black/95 border-none flex flex-row gap-0 overflow-hidden outline-none'>
        <VisuallyHidden>
          <DialogTitle>Media Viewer</DialogTitle>
          <DialogDescription>View images and videos from the chat</DialogDescription>
        </VisuallyHidden>

        {/* Main Content Area */}
        <div className='flex-1 relative flex items-center justify-center p-4 min-w-0'>
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

          {/* Media Content */}
          <div className='w-full h-full flex items-center justify-center'>
            {currentMedia.type === 'video' ? (
              <video
                src={currentMedia.url}
                controls
                className='max-w-full max-h-full object-contain'
                autoPlay
              />
            ) : (
              <img
                src={currentMedia.url}
                alt={currentMedia.originalName}
                className='max-w-full max-h-full object-contain'
              />
            )}
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

        {/* Sidebar Thumbnails */}
        <div className='w-[120px] sm:w-[150px] border-l border-white/10 bg-black/50 backdrop-blur-sm h-full flex flex-col'>
          <div className='p-3 text-white/70 text-sm font-medium border-b border-white/10 text-center'>
            {currentMediaIndex + 1} / {mediaList.length}
          </div>
          <ScrollArea className='flex-1 h-full'>
            <div className='flex flex-col gap-2 p-2'>
              {mediaList.map((media) => {
                const isSelected = media.id === currentMedia.id
                return (
                  <button
                    key={media.id}
                    onClick={() => handleSelectMedia(media.id)}
                    className={`relative aspect-square w-full rounded-md overflow-hidden border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-primary opacity-100 ring-2 ring-primary/50'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {media.type === 'video' ? (
                      <video
                        src={media.url}
                        className='w-full h-full object-cover pointer-events-none'
                      />
                    ) : (
                      <img
                        src={media.url}
                        alt={media.originalName}
                        className='w-full h-full object-cover'
                      />
                    )}
                    {media.type === 'video' && (
                      <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                        <div className='w-6 h-6 rounded-full bg-black/50 flex items-center justify-center'>
                          <div className='w-0 h-0 border-t-4 border-t-transparent border-l-8 border-l-white border-b-4 border-b-transparent ml-0.5'></div>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}
