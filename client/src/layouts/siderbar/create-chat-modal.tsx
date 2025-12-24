import { UserAvatar } from '@/components/avatar'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { APP_PAGES } from '@/constants/link.const'
import { CreateGroupModal } from '@/features/chat/components/create-group-modal'
import { chatRequest } from '@/features/chat/services'
import { friendRequest } from '@/features/friend/services'
import { useSocketStore } from '@/stores/socket.store'
import type { IUser } from '@/types/api.types'
import { Loader2, Search, UserPlus, Users } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

export function CreateChatModal() {
  const [open, setOpen] = useState(false)
  const [openGroup, setOpenGroup] = useState(false)
  const [search, setSearch] = useState('')
  const [friends, setFriends] = useState<IUser[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { socket } = useSocketStore()
  const navigate = useNavigate()

  // Fetch friends when modal opens
  const handleOpenChange = (value: boolean) => {
    setOpen(value)
    if (value) {
      loadFriends()
    }
  }

  const loadFriends = async () => {
    try {
      setIsLoading(true)
      const data = await friendRequest.getListFriend()
      setFriends(data)
    } catch (error) {
      toast.error('Lỗi tải danh sách bạn bè')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateChat = async (userId: string) => {
    try {
      const data = await chatRequest.getOrCreateChatByUserId(userId)
      navigate(`${APP_PAGES.CHAT}/${data.id}`)
      setOpen(false)
    } catch (error) {
      toast.error('Lỗi tạo cuộc trò chuyện')
    }
  }

  const filteredFriends = friends.filter((friend) =>
    friend.displayName.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <>
      <CreateGroupModal
        open={openGroup}
        onOpenChange={setOpenGroup}
        friends={friends}
        onSuccess={() => setOpen(false)}
      />
      <div className='h-14 shrink-0 p-2 flex border-b gap-3'>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button
              variant='secondary'
              className='flex-1 h-full justify-start text-muted-foreground'
            >
              <Search />
              Tìm hoặc bắt đầu cuộc trò chuyện
            </Button>
          </DialogTrigger>
          <DialogContent className='sm:max-w-[425px] h-[500px] flex flex-col gap-0 p-0'>
            <DialogHeader className='p-6 pb-2'>
              <DialogTitle>Tạo cuộc trò chuyện</DialogTitle>
            </DialogHeader>
            <div className='px-4 pb-2'>
              <div className='relative'>
                <Search className='absolute left-2 top-2.5 h-4 w-4 text-muted-foreground' />
                <Input
                  placeholder='Tìm kiếm bạn bè...'
                  className='pl-8'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button
                variant='ghost'
                className='w-full justify-start mt-2'
                onClick={() => setOpenGroup(true)}
              >
                <div className='flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 mr-2'>
                  <Users className='h-4 w-4 text-primary' />
                </div>
                Tạo nhóm chat mới
              </Button>
            </div>
            <div className='flex-1 overflow-y-auto px-2'>
              <h3 className='text-xs font-semibold text-muted-foreground px-2 py-2'>
                BẠN BÈ ({filteredFriends.length})
              </h3>
              <div className='space-y-1'>
                {isLoading ? (
                  <div className='flex items-center justify-center py-8'>
                    <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
                  </div>
                ) : (
                  <>
                    {filteredFriends.map((friend) => (
                      <Button
                        key={friend.id}
                        variant='ghost'
                        className='w-full justify-start h-14'
                        onClick={() => handleCreateChat(friend.id)}
                      >
                        <UserAvatar user={friend} />
                        <div className='flex flex-col items-start'>
                          <span className='font-medium'>{friend.displayName}</span>
                          <span className='text-xs text-muted-foreground'>{friend.email}</span>
                        </div>
                      </Button>
                    ))}
                    {filteredFriends.length === 0 && (
                      <div className='text-center text-sm text-muted-foreground py-8'>
                        Không tìm thấy bạn bè nào
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant={'outline'} size={'icon-lg'} asChild>
          <Link to={APP_PAGES.ADD_FRIENDS}>
            <UserPlus />
          </Link>
        </Button>
      </div>
    </>
  )
}
