import { UserAvatar } from '@/components/avatar'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { chatRequest } from '@/features/chat/services/chat.request'
import type { IChatResDto } from '@/features/chat/services/chat.res.dto'
import { friendRequest } from '@/features/friend/services/friend.request'
import { useQuery } from '@/hooks/use-query'
import { useRequest } from '@/hooks/use-request'
import { useAppStore } from '@/stores/app.store'
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

interface AddMemberModalProps {
  chat: IChatResDto
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function AddMemberModal({ chat, open, onOpenChange, onSuccess }: AddMemberModalProps) {
  const { isLoading } = useAppStore()
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])

  // Fetch friends list
  const { data } = useQuery(friendRequest.getListFriend, undefined)
  const friends = data || []

  // Filter out users who are already participants
  const availableFriends = useMemo(() => {
    // Note: p.user.id is used because ParticipantResDto structure contains nested user object
    const participantIds = chat.participants.filter((p) => !p.deletedAt).map((p) => p.user.id)
    return friends.filter((friend) => !participantIds.includes(friend.id))
  }, [friends, chat.participants])

  const addMembers = useRequest(
    async (userIds: string[]) => {
      const res = await chatRequest.addMembers(chat.id, userIds)
      return res
    },
    {
      onSuccess: () => {
        toast.success('Thêm thành viên thành công')
        onOpenChange(false)
        setSelectedFriends([])
        onSuccess?.()
      },
      onError: () => {
        toast.error('Thêm thành viên thất bại')
      },
    },
  )

  const handleAddMembers = () => {
    if (selectedFriends.length === 0) return
    addMembers(selectedFriends)
  }

  const toggleFriend = (friendId: string) => {
    setSelectedFriends((prev) =>
      prev.includes(friendId) ? prev.filter((id) => id !== friendId) : [...prev, friendId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-[425px] lg:max-w-[600px]'>
        <DialogHeader>
          <DialogTitle>Thêm thành viên vào nhóm</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='space-y-4'>
            <Label>Chọn bạn bè ({selectedFriends.length})</Label>
            <div className='max-h-[300px] overflow-y-auto space-y-2 border rounded-md p-2'>
              {availableFriends.length === 0 ? (
                <p className='text-center text-sm text-muted-foreground py-4'>
                  Không có bạn bè nào để thêm
                </p>
              ) : (
                availableFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className='flex items-center space-x-2 p-2 hover:bg-accent rounded-sm cursor-pointer'
                    onClick={() => toggleFriend(friend.id)}
                  >
                    <Checkbox
                      checked={selectedFriends.includes(friend.id)}
                      onCheckedChange={() => toggleFriend(friend.id)}
                    />
                    <UserAvatar user={friend} size={'sm'} />
                    <span className='text-sm font-medium'>{friend.displayName}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type='submit'
            onClick={handleAddMembers}
            disabled={selectedFriends.length === 0 || isLoading}
          >
            Thêm thành viên
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
