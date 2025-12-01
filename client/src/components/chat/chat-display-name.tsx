import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAppStore } from '@/hooks/stores/app.store'
import { useChatName } from '@/hooks/use-chat-name'
import { useRequest } from '@/hooks/use-request'
import type { IChat } from '@/services/api.types'
import { chatRequest } from '@/services/chats'
import {
  UpdateChatDisplayNameReqBodyDto,
  type IUpdateChatDisplayNameReqBodyDto,
} from '@/services/chats/chat.req.dto'
import { zodResolver } from '@hookform/resolvers/zod'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { ChatAvatar } from '../siderbar/chat-avatar'
import { Button } from '../ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'

export function ChatDisplayName({ chat }: { chat: IChat }) {
  const [open, onOpenChange] = useState(false)
  const groupInfo = chat.groupInfo
  const { chatDisplayName, directChatMember } = useChatName(chat)
  const form = useForm<IUpdateChatDisplayNameReqBodyDto>({
    resolver: zodResolver(UpdateChatDisplayNameReqBodyDto),
    defaultValues: {
      displayName: chatDisplayName,
    },
  })

  const { isLoading } = useAppStore()
  const onSubmit = useRequest(
    (body: IUpdateChatDisplayNameReqBodyDto) => chatRequest.updateChatDisplayName(chat.id, body),
    {
      setError: form.setError,
      messageSuccess: 'Đổi tên thành công!',
      onSuccess: () => {
        onOpenChange(false)
      },
    },
  )
  return (
    <p className='capitalize font-bold flex w-full items-center justify-center gap-2'>
      {chatDisplayName}

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          <Button variant='ghost' size={'icon-sm'}>
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent className='sm:max-w-[425px]'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <DialogHeader className='border-b pb-2'>
                <DialogTitle>{groupInfo ? 'Đổi tên nhóm' : 'Đặt biệt danh'}</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
              <div className='w-full flex flex-col items-center justify-center space-y-3 py-3'>
                <ChatAvatar chatItem={chat} isBigSize />
                {groupInfo ? (
                  <p className='text-center text-sm'>
                    Bạn có chắc chắn muốn đổi tên nhóm, khi xác nhận tên nhóm sẽ được thay đổi cho
                    tất cả thành viên
                  </p>
                ) : (
                  <p className='text-center text-sm'>
                    Hãy đặt cho <b className='capitalize'>{directChatMember.user.displayName} </b>{' '}
                    một cái tên thật dễ nhớ!
                  </p>
                )}
              </div>
              <FormField
                control={form.control}
                name='displayName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel />
                    <FormControl>
                      <Input
                        placeholder={groupInfo ? 'Nhập tên nhóm' : 'Nhập biệt danh'}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <DialogClose asChild>
                  <Button variant='outline'>Hủy</Button>
                </DialogClose>
                <Button disabled={isLoading} type='submit'>
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </p>
  )
}
