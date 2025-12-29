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
import { APP_PAGES } from '@/constants/link.const'
import { chatRequest } from '@/features/chat/services'
import { useRequest } from '@/hooks/use-request'
import type { IChat } from '@/types/api.types'
import { File, Image, Info, Link, Lock, Trash2, Users, X } from 'lucide-react'
import { useState } from 'react'
import { ChatMemberList } from '../../../layouts/siderbar/chat-member'
import { ChatDisplayName } from './chat-display-name'

export function ChatInfo({ chat }: { chat: IChat }) {
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
                  <Lock className='size-4' />
                  Tuỳ chỉnh đoạn chat
                </span>
              </AccordionTrigger>
              <AccordionContent>Chức năng này hiện đang được phát triển.</AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-3'>
              <AccordionTrigger>
                <span className='text-sm flex items-center gap-2 font-bold'>
                  <Image className='size-4' />
                  Ảnh/video
                </span>
              </AccordionTrigger>
              <AccordionContent>Chức năng này hiện đang được phát triển.</AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-4'>
              <AccordionTrigger>
                <span className='text-sm flex items-center gap-2 font-bold'>
                  <File className='size-4' />
                  File
                </span>
              </AccordionTrigger>
              <AccordionContent>Chức năng này hiện đang được phát triển.</AccordionContent>
            </AccordionItem>
            <AccordionItem value='item-5'>
              <AccordionTrigger>
                <span className='text-sm flex items-center gap-2 font-bold'>
                  <Link className='size-4' />
                  Links
                </span>
              </AccordionTrigger>
              <AccordionContent>Chức năng này hiện đang được phát triển.</AccordionContent>
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
    </Drawer>
  )
}
