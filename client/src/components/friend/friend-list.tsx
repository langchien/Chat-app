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
import { SOCKET_EVENTS } from '@/constants/event.const'
import { APP_PAGES } from '@/constants/link.const'
import { useSocketStore } from '@/hooks/stores/socket.store'
import { useRequest } from '@/hooks/use-request'
import type { IUser } from '@/services/api.types'
import { chatRequest } from '@/services/chats'
import { Info, MessageCircle, MoreHorizontal, Phone, Trash, Video } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { UserInfoModal } from '../user-info-modal'
import { UnfriendBtn } from './unfriend-btn'

export function FriendList({ friends }: { friends: IUser[] }) {
  const { socket } = useSocketStore()
  const navigate = useNavigate()
  const handleGoChat = useRequest((userId: string) => chatRequest.getOrCreateChatByUserId(userId), {
    onSuccess: (data) => {
      navigate(APP_PAGES.CHAT + `/${data.id}`)
      if (socket) socket.emit(SOCKET_EVENTS.JOIN_CHAT, data.id)
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
    <div>
      <h2 className='text-lg font-semibold pb-3 border-b'>{`Tất cả bạn bè-(${listFriend.length})`}</h2>
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
  )
}
