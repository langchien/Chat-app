import { ChatAvatar } from '@/components/avatar'
import { Button } from '@/components/ui/button'
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useChatDisplayName } from '@/features/chat/hooks/use-chat-display-name'
import type { IChat } from '@/types/api.types'
import { Edit } from 'lucide-react'

export function ChatDisplayName({ chat }: { chat: IChat }) {
  const {
    open,
    onOpenChange,
    groupInfo,
    chatDisplayName,
    directChatMember,
    form,
    isLoading,
    onSubmit,
  } = useChatDisplayName(chat)
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
                <ChatAvatar chatItem={chat} />
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
