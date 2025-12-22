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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { chatRequest } from '@/features/chat/services'
import { useRequest } from '@/hooks/use-request'
import { useAppStore } from '@/stores/app.store'
import { useAuthStore } from '@/stores/auth.store'
import type { IUser } from '@/types/api.types'
import { useState } from 'react'
import { toast } from 'sonner'

interface CreateGroupModalProps {
  friends: IUser[]
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function CreateGroupModal({
  friends,
  open,
  onOpenChange,
  onSuccess,
}: CreateGroupModalProps) {
  const { user } = useAuthStore()
  const { isLoading } = useAppStore()
  const [groupName, setGroupName] = useState('')
  const [selectedFriends, setSelectedFriends] = useState<string[]>([])

  const createGroup = useRequest(
    async (data: Parameters<typeof chatRequest.create>[0]) => {
      const res = await chatRequest.create(data)
      return res
    },
    {
      onSuccess: () => {
        toast.success('Tạo nhóm thành công')
        onOpenChange(false)
        setGroupName('')
        setSelectedFriends([])
        onSuccess?.()
      },
      onError: () => {
        toast.error('Tạo nhóm thất bại')
      },
    },
  )

  const handleCreateGroup = () => {
    if (!user) return
    createGroup({
      type: 'group',
      groupInfo: {
        name: groupName,
        createdBy: user.id,
      },
      receiverIds: selectedFriends,
    })
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
          <DialogTitle>Tạo nhóm chat mới</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          <div className='flex flex-col gap-4'>
            <Label htmlFor='name' className='text-right w-full'>
              Tên nhóm
            </Label>
            <Input
              id='name'
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className='w-full'
              placeholder='Nhập tên nhóm...'
            />
          </div>
          <div className='space-y-4'>
            <Label>Chọn thành viên ({selectedFriends.length})</Label>
            <div className='max-h-[300px] overflow-y-auto space-y-2 border rounded-md p-2'>
              {friends.length === 0 ? (
                <p className='text-center text-sm text-muted-foreground py-4'>Chưa có bạn bè nào</p>
              ) : (
                friends.map((friend) => (
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
            onClick={handleCreateGroup}
            disabled={!groupName.trim() || selectedFriends.length === 0 || isLoading}
          >
            Tạo nhóm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
