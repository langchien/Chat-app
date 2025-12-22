import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { UserInfoModal } from '@/components/user-info-modal'
import { SOCKET_EVENTS } from '@/constants/event.const'
import { APP_PAGES } from '@/constants/link.const'
import { CreateGroupModal } from '@/features/chat/components/create-group-modal'
import { chatRequest } from '@/features/chat/services'
import { useRequest } from '@/hooks/use-request'
import { useSocketStore } from '@/stores/socket.store'
import type { IUser } from '@/types/api.types'
import { Info, MessageCircle, MoreHorizontal, Phone, Plus, Trash, Video } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { UnfriendBtn } from './unfriend-btn'

export function FriendList({ friends }: { friends: IUser[] }) {
  const { socket } = useSocketStore()
  const navigate = useNavigate()
  const [openCreateGroup, setOpenCreateGroup] = useState(false)

  const handleGoChat = useRequest((userId: string) => chatRequest.getOrCreateChatByUserId(userId), {
    onSuccess: (data) => {
      navigate(APP_PAGES.CHAT + `/${data.id}`)
    },
  })
  const [listFriend, setListFriend] = useState<IUser[]>(friends)
  useEffect(() => {
    if (!socket) return
    const onUnfriend = (userId: string) => {
      setListFriend((prev) => prev.filter((user) => user.id !== userId))
    }
    socket.on(SOCKET_EVENTS.UNFRIEND, onUnfriend)
    return () => {
      socket.off(SOCKET_EVENTS.UNFRIEND, onUnfriend)
    }
  }, [socket])

  return (
    <>
      <CreateGroupModal
        open={openCreateGroup}
        onOpenChange={setOpenCreateGroup}
        friends={listFriend}
      />
      <div>
        <div className='flex items-center justify-between pb-3 border-b'>
          <h2 className='text-lg font-semibold'>{`Tất cả bạn bè (${listFriend.length})`}</h2>
          <Button size='sm' onClick={() => setOpenCreateGroup(true)}>
            <Plus className='mr-2 h-4 w-4' /> Tạo nhóm
          </Button>
        </div>
        <div className='flex flex-col space-y-2 py-3'>
          {listFriend.map((user) => (
            <div key={user.id} className='flex items-center space-x-2 group/friend'>
              <UserInfoModal user={user} />
              <div className='ms-auto'>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button onClick={() => handleGoChat(user.id)} variant='ghost' size='icon-lg'>
                      <MessageCircle />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Chat ngay</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant='ghost' size='icon-lg'>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className='w-56' align='start'>
                        <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                          <DropdownMenuItem>
                            Xem thông tin
                            <Info className='ms-auto' />
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Bắt đầu cuộc gọi video
                            <Video className='ms-auto' />
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Bắt đầu cuộc gọi thoại
                            <Phone className='ms-auto' />
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <UnfriendBtn userId={user.id}>
                            <DropdownMenuItem
                              variant='destructive'
                              onSelect={(e) => {
                                e.preventDefault()
                              }}
                            >
                              Xóa bạn
                              <Trash className='ms-auto' />
                            </DropdownMenuItem>
                          </UnfriendBtn>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Những mục khác</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
