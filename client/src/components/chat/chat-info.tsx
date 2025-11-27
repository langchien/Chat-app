/* eslint-disable react/no-unescaped-entities */
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { IChat } from '@/services/api.types'
import { Bell, Flag, Info, Lock, Search, Trash2, X } from 'lucide-react'
import { useState } from 'react'

export function ChatInfo({ chat }: { chat: IChat }) {
  const [open, onOpenChange] = useState(false)
  // const { imageUrl, name } = getConversationInfo(conversation)
  const onClose = () => onOpenChange(false)

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction='right'>
      <DrawerTrigger asChild>
        <Button variant='ghost' size='icon' className='h-9 w-9'>
          <Info className='h-5 w-5' />
        </Button>
      </DrawerTrigger>
      <DrawerContent className='h-full w-72 ml-auto rounded-none'>
        <DrawerHeader className='p-0'>
          <div className='flex justify-between items-center p-4 border-b border-border'>
            <DrawerTitle className='text-lg font-bold'>Thông tin đoạn chat</DrawerTitle>
            <Button variant='ghost' size='icon' onClick={onClose}>
              <X className='h-5 w-5' />
            </Button>
          </div>
        </DrawerHeader>

        {/* User Profile */}
        <div className='p-6 border-b border-border text-center'>
          <Avatar className='h-20 w-20 mx-auto mb-4'>
            {/* <AvatarImage src={imageUrl || '/placeholder.svg'} alt={name} /> */}
            {/* <AvatarFallback>{getInitials(name)}</AvatarFallback> */}
          </Avatar>
          {/* <h3 className='font-bold text-lg'>{name}</h3> */}
          <p className='text-xs text-muted-foreground mt-1'>Được mở hôa đầu cuối</p>
        </div>

        {/* Actions */}
        <ScrollArea className='flex-1 p-4'>
          <div className='space-y-2'>
            <Button variant='ghost' className='w-full justify-start gap-2 h-auto py-3'>
              <Search className='h-5 w-5' />
              <div className='text-left'>
                <div className='font-medium text-sm'>Trang c n...</div>
                <div className='text-xs text-muted-foreground'>Tìm kiếm</div>
              </div>
            </Button>

            <Button variant='ghost' className='w-full justify-start gap-2 h-auto py-3'>
              <Bell className='h-5 w-5' />
              <div className='text-left'>
                <div className='font-medium text-sm'>Tất thông báo</div>
                <div className='text-xs text-muted-foreground'>Tìm kiếm</div>
              </div>
            </Button>

            <Button variant='ghost' className='w-full justify-start gap-2 h-auto py-3'>
              <Lock className='h-5 w-5' />
              <div className='text-left'>
                <div className='font-medium text-sm'>Xem tìn nhân đã ghim</div>
                <div className='text-xs text-muted-foreground'>(0)</div>
              </div>
            </Button>
          </div>

          <div className='border-t border-border mt-4 pt-4'>
            <Accordion type='multiple' className='w-full'>
              <AccordionItem value='item-1'>
                <AccordionTrigger>
                  <span className='text-sm flex items-center gap-2'>
                    <Flag className='h-4 w-4' />
                    Xem tìn nhân đã ghim
                  </span>
                </AccordionTrigger>
                <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-2'>
                <AccordionTrigger>
                  <span className='text-sm flex items-center gap-2'>
                    <Lock className='h-4 w-4' />
                    Tuỳ chỉnh đoạn chat
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It comes with default styles that matches the other components&apos;
                  aesthetic.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-3'>
                <AccordionTrigger>
                  <span className='text-sm'>File phương tiện & file</span>
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It's animated by default, but you can disable it if you prefer.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value='item-4'>
                <AccordionTrigger>
                  <span className='text-sm'>Quyền riêng tư hỗ trợ</span>
                </AccordionTrigger>
                <AccordionContent>
                  Yes. It's animated by default, but you can disable it if you prefer.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </ScrollArea>

        {/* Danger Zone */}
        <div className='p-4 border-t border-border'>
          <Button
            variant='ghost'
            className='w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10'
          >
            <Trash2 className='h-5 w-5' />
            Xoá cuộc trò chuyện
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
