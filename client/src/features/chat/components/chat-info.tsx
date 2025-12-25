import { ChatAvatar } from '@/components/avatar'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SOCKET_EVENTS } from '@/constants/event.const'
import { ChatMemberList } from '@/features/chat/components/chat-member'
import { useSocketStore } from '@/stores/socket.store'
import type { IMedia } from '@/types/api.types'
import {
  File,
  Film,
  Image,
  Info,
  Link as LinkIcon,
  Trash2,
  Users,
  Video as VideoIcon,
  X,
} from 'lucide-react'
import { Suspense, useState } from 'react'
import { useLoaderData } from 'react-router'
import type { clientLoader } from '../pages/chat'
import { ChatDisplayName } from './chat-display-name'
import { ChatFileList } from './chat-info-item/file-list'
import { HlsMediaList } from './chat-info-item/hls-media-list'
import { HlsMediaListModal } from './chat-info-item/hls-media-list-modal'
import { LinksList } from './chat-info-item/link-list'
import { LoadingFallback } from './chat-info-item/loading-falback'
import { MediaList } from './chat-info-item/media-list'
import { MediaListModal } from './chat-info-item/media-list-modal'

export function ChatInfo() {
  const { chat, linksPromise, mediaPromise } = useLoaderData<typeof clientLoader>()
  const [open, onOpenChange] = useState(false)
  const onClose = () => onOpenChange(false)
  const { socket } = useSocketStore()
  const onDeleteChat = () => {
    if (!socket) return
    socket.emit(SOCKET_EVENTS.DELETE_CONVERSATION, {
      chatId: chat.id,
    })
  }
  const [mediaId, setMediaId] = useState<string | null>(null)
  const onMediaClick = (media: IMedia) => {
    setMediaId(media.id)
  }
  const [hlsMediaId, setHlsMediaId] = useState<string | null>(null)
  const onHlsMediaClick = (media: IMedia) => {
    setHlsMediaId(media.id)
  }
  return (
    <>
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
                  <ChatMemberList chat={chat} />
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
                    <MediaList
                      mediaPromise={mediaPromise}
                      type='image'
                      onMediaClick={onMediaClick}
                    />
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
                    <MediaList
                      mediaPromise={mediaPromise}
                      type='video'
                      onMediaClick={onMediaClick}
                    />
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
                    <HlsMediaList mediaPromise={mediaPromise} onMediaClick={onHlsMediaClick} />
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
        <MediaListModal mediaId={mediaId} setMediaId={setMediaId} />
        <HlsMediaListModal mediaId={hlsMediaId} setMediaId={setHlsMediaId} />
      </Drawer>
    </>
  )
}
