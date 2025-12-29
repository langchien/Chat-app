import { SOCKET_EVENTS } from '@/constants/event.const'
import { useSocketStore } from '@/stores/socket.store'
import type { IChat, IMessage } from '@/types/api.types'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { chatRequest, type IChatPaginateCursorResDto } from '../services'

const INIT_LIMIT = 20
export function useChatList(paginateData: IChatPaginateCursorResDto) {
  const [chatList, setChatList] = useState<IChat[]>(paginateData.data)
  const [hasMore, setHasMore] = useState(paginateData.hasMore)
  const [nextCursor, setNextCursor] = useState(paginateData.nextCursor)
  const getMore = async () => {
    if (!nextCursor) return
    const response = await chatRequest.paginate({
      limit: INIT_LIMIT,
      cursor: nextCursor,
    })
    setChatList([...chatList, ...response.data])
    setNextCursor(response.nextCursor)
    setHasMore(response.hasMore)
  }
  const { chatId } = useParams()
  const chatGroups = chatList.filter((chat) => chat.type === 'group')
  const chatDirects = chatList.filter((chat) => chat.type === 'direct')
  const socket = useSocketStore((state) => state.socket)

  useEffect(() => {
    if (!socket) return
    const handleReceiveMessage = (payload: { message: IMessage; chat: IChat }) => {
      const _data = chatList.filter((c) => c.id !== payload.chat.id)
      setChatList([payload.chat, ..._data])
    }
    const handleUpdateChat = (updatedChat: IChat) => {
      const _data = chatList.filter((c) => c.id !== updatedChat.id)
      setChatList([updatedChat, ..._data])
    }
    const handleDeleteChat = ({ chatId }: { chatId: string }) => {
      const _data = chatList.filter((c) => c.id !== chatId)
      setChatList(_data)
    }
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
    socket.on(SOCKET_EVENTS.UPDATE_CHAT, handleUpdateChat)
    socket.on(SOCKET_EVENTS.DELETE_CHAT, handleDeleteChat)
    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
      socket.off(SOCKET_EVENTS.UPDATE_CHAT, handleUpdateChat)
      socket.off(SOCKET_EVENTS.DELETE_CHAT, handleDeleteChat)
    }
  }, [socket, chatList, setChatList])

  return {
    chatList,
    chatGroups,
    chatDirects,
    chatId,
    getMore,
    hasMore,
  }
}
