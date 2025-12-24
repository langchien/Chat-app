import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useRequest } from '@/hooks/use-request'
import { friendRequest } from '@/services/friend'

export function UnfriendBtn({ userId, children }: { userId: string; children: React.ReactNode }) {
  const onUnfriend = useRequest(() => friendRequest.deleteFriendByUserId(userId), {
    messageSuccess: 'Xóa bạn bè thành công',
  })
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Bạn chắc chắn muốn xóa bạn bè này?</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa bạn bè này không?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Hủy</AlertDialogCancel>
          <AlertDialogAction onClick={onUnfriend}>Xóa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
