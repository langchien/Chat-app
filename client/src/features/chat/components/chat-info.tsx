import { ChatAvatar } from '@/components/avatar'
import { StreamVideoHLS } from '@/components/hls-stream'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { APP_PAGES } from '@/constants/link.const'
import { ChatMemberList } from '@/features/chat/components/chat-member'
import { chatRequest } from '@/features/chat/services'
import { useRequest } from '@/hooks/use-request'
import type { IChat, IMedia } from '@/types/api.types'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import {
  File,
  Film,
  Image,
  Info,
  Link as LinkIcon,
  Loader2,
  Trash2,
  Users,
  Video as VideoIcon,
  X,
} from 'lucide-react'
import { Suspense, use, useState } from 'react'
import type { IChatLink } from '../services/chat.res.dto'
import { ChatDisplayName } from './chat-display-name'

function MediaViewerModal({
  media,
  open,
  onOpenChange,
}: {
  media: IMedia | null
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  if (!media) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[95vw] p-0 overflow-hidden bg-black/90 border-none'>
        <VisuallyHidden>
          <DialogTitle>Media Viewer</DialogTitle>
          <DialogDescription>Viewing media: {media.originalName}</DialogDescription>
        </VisuallyHidden>
        <div className='relative flex items-center justify-center w-full h-[80vh]'>
          {media.type === 'image' && (
            <img src={media.url} alt='media' className='max-w-full max-h-full object-contain' />
          )}
          {media.type === 'video' && (
            <video src={media.url} controls className='max-w-full max-h-full' autoPlay />
          )}
          {media.type === 'video_hls' && (
            <div className='w-full h-full flex items-center justify-center'>
              <StreamVideoHLS src={media.url} className='max-w-full max-h-full w-full' />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function LinksList({ linksPromise }: { linksPromise: Promise<IChatLink[]> }) {
  const links = use(linksPromise)

  if (links.length === 0) {
    return (
      <div className='text-sm text-center text-muted-foreground py-2'>Không có liên kết nào</div>
    )
  }

  return (
    <div className='space-y-2'>
      {links.map((link, i) => (
        <a
          key={i}
          href={link.url}
          target='_blank'
          rel='noopener noreferrer'
          className='block p-2 text-sm bg-muted/50 rounded hover:bg-muted truncate text-blue-500 hover:underline'
        >
          {link.url}
        </a>
      ))}
    </div>
  )
}

function MediaList({
  mediaPromise,
  type,
  onMediaClick,
}: {
  mediaPromise: Promise<IMedia[]>
  type: 'image' | 'video' | 'video_hls'
  onMediaClick: (media: IMedia) => void
}) {
  const allMedia = use(mediaPromise)
  const media = allMedia.filter((m) => {
    if (type === 'image') return m.type === 'image'
    if (type === 'video') return m.type === 'video'
    if (type === 'video_hls') return m.type === 'video_hls'
    return false
  })

  if (media.length === 0) {
    let label = 'ảnh'
    if (type === 'video') label = 'video'
    if (type === 'video_hls') label = 'phim'
    return (
      <div className='text-sm text-center text-muted-foreground py-2'>
        Acknowledgement: Không có {label} nào
      </div>
    )
  }

  return (
    <div className='grid grid-cols-3 gap-2'>
      {media.map((item) => (
        <div
          key={item.id}
          className='relative aspect-square bg-muted rounded overflow-hidden cursor-pointer hover:opacity-90'
          onClick={() => onMediaClick(item)}
        >
          {type === 'image' ? (
            <img src={item.url} alt='media' className='object-cover w-full h-full' />
          ) : (
            <div className='relative w-full h-full bg-black flex items-center justify-center'>
              {type === 'video' ? (
                <>
                  <video
                    src={item.url}
                    className='object-cover w-full h-full'
                    muted
                    preload='metadata'
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/20'>
                    <VideoIcon className='text-white w-8 h-8 opacity-70' />
                  </div>
                </>
              ) : (
                <Film className='text-white w-8 h-8 opacity-70' />
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ChatFileList({ mediaPromise }: { mediaPromise: Promise<IMedia[]> }) {
  const allMedia = use(mediaPromise)
  const files = allMedia.filter((m) => !['image', 'video', 'video_hls'].includes(m.type))

  if (files.length === 0) {
    return <div className='text-sm text-center text-muted-foreground py-2'>Không có file nào</div>
  }

  return (
    <div className='space-y-2'>
      {files.map((file) => (
        <a
          key={file.id}
          href={file.url}
          target='_blank'
          rel='noopener noreferrer'
          className='flex items-center gap-2 p-2 rounded hover:bg-muted group'
        >
          <div className='bg-muted-foreground/10 p-2 rounded'>
            <File className='size-5 text-muted-foreground group-hover:text-foreground' />
          </div>
          <div className='flex-1 min-w-0'>
            <p className='text-sm font-medium truncate'>{file.originalName}</p>
            <span className='text-xs text-muted-foreground'>{file.type}</span>
          </div>
        </a>
      ))}
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className='flex justify-center p-4'>
      <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
    </div>
  )
}

interface ChatInfoProps {
  chat: IChat
  linksPromise: Promise<IChatLink[]>
  mediaPromise: Promise<IMedia[]>
}

export function ChatInfo({ chat, linksPromise, mediaPromise }: ChatInfoProps) {
  const [selectedMedia, setSelectedMedia] = useState<IMedia | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  const onMediaClick = (media: IMedia) => {
    setSelectedMedia(media)
    setModalOpen(true)
  }

  const [open, onOpenChange] = useState(false)
  const onClose = () => onOpenChange(false)
  const onDeleteChat = useRequest(() => chatRequest.delete(chat.id), {
    messageSuccess: 'Đã xoá cuộc trò chuyện',
    redirectUrl: APP_PAGES.CHAT,
  })

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction='right'>
      <DrawerTrigger asChild>
        <Button variant='ghost' size='icon-lg' className='h-9 w-9'>
          <Info />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-screen w-72 ml-auto rounded-none'>
        <DrawerHeader className='w-full flex flex-row justify-baseline items-center border-b border-border'>
          <DrawerTitle className='flex-1 text-center text-lg font-bold'>
            Thông tin đoạn chat
          </DrawerTitle>
          <Button variant='ghost' size='icon-lg' onClick={onClose}>
            <X />
          </Button>
        </DrawerHeader>

        <div className='p-3 border-border w-full flex flex-col space-y-2 justify-center items-center border-b'>
          <ChatAvatar chatItem={chat} size='lg' />
          <ChatDisplayName chat={chat} />
        </div>

        <ScrollArea className='flex-1 overflow-auto'>
          <Accordion type='multiple' className='w-full p-4 space-y-2'>
            <AccordionItem value='item-1'>
              <AccordionTrigger>
                <span className='text-sm flex items-center gap-2 font-bold'>
                  <Users className='size-4' />
                  Danh sách thành viên
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <ChatMemberList participants={chat.participants} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-2'>
              <AccordionTrigger>
                <span className='text-sm flex items-center gap-2 font-bold'>
                  <Image className='size-4' />
                  Ảnh
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Suspense fallback={<LoadingFallback />}>
                  <MediaList mediaPromise={mediaPromise} type='image' onMediaClick={onMediaClick} />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>
                <span className='text-sm flex items-center gap-2 font-bold'>
                  <VideoIcon className='size-4' />
                  Video
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Suspense fallback={<LoadingFallback />}>
                  <MediaList mediaPromise={mediaPromise} type='video' onMediaClick={onMediaClick} />
                </Suspense>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='item-4'>
              <AccordionTrigger>
                <span className='text-sm flex items-center gap-2 font-bold'>
                  <Film className='size-4' />
                  Phim
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Suspense fallback={<LoadingFallback />}>
                  <MediaList
                    mediaPromise={mediaPromise}
                    type='video_hls'
                    onMediaClick={onMediaClick}
                  />
                </Suspense>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value='item-5'>
              <AccordionTrigger>
                <span className='text-sm flex items-center gap-2 font-bold'>
                  <File className='size-4' />
                  File
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Suspense fallback={<LoadingFallback />}>
                  <ChatFileList mediaPromise={mediaPromise} />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-6'>
              <AccordionTrigger>
                <span className='text-sm flex items-center gap-2 font-bold'>
                  <LinkIcon className='size-4' />
                  Links
                </span>
              </AccordionTrigger>
              <AccordionContent>
                <Suspense fallback={<LoadingFallback />}>
                  <LinksList linksPromise={linksPromise} />
                </Suspense>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>

        <Button
          onClick={onDeleteChat}
          variant='destructiveOutline'
          size={'lg'}
          className='mt-auto border-t w-full rounded-none'
        >
          <Trash2 className='h-5 w-5' />
          Xoá cuộc trò chuyện
        </Button>
      </DrawerContent>
      <MediaViewerModal media={selectedMedia} open={modalOpen} onOpenChange={setModalOpen} />
    </Drawer>
  )
}
