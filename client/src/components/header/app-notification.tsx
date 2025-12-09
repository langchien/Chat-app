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
import { Bell } from 'lucide-react'

export function AppNotification() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'icon-sm'} variant='ghost'>
          <Bell />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Thông báo</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>Todo</div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant='outline'>Cancel</Button>
          </DialogClose>
          <Button>Đánh dấu đã xem</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
