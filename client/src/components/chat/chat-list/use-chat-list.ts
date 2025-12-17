import { SOCKET_EVENTS } from '@/constants/event.const'
import type { IChat, IMessage } from '@/services/api.types'
import { useChatStore } from '@/stores/chat.store'
import { useSocketStore } from '@/stores/socket.store'
import { useEffect } from 'react'
import { useParams } from 'react-router'

export function useChatList() {
  const data = useChatStore((state) => state.data)
  const setChatList = useChatStore((state) => state.setChatList)
  const getMore = useChatStore((state) => state.getMore)
  const hasMore = useChatStore((state) => state.hasMore)
  const { chatId } = useParams()
  const chatGroups = data.filter((chat) => chat.type === 'group')
  const chatDirects = data.filter((chat) => chat.type === 'direct')
  const socket = useSocketStore((state) => state.socket)

  useEffect(() => {
    if (!socket) return
    const handleReceiveMessage = (payload: { message: IMessage; chat: IChat }) => {
      const _data = data.filter((c) => c.id !== payload.chat.id)
      setChatList([payload.chat, ..._data])
    }
    const handleUpdateChat = (updatedChat: IChat) => {
      const _data = data.filter((c) => c.id !== updatedChat.id)
      setChatList([updatedChat, ..._data])
    }
    const handleDeleteChat = ({ chatId }: { chatId: string }) => {
      const _data = data.filter((c) => c.id !== chatId)
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
  }, [socket, data, setChatList])

  return {
    data,
    chatGroups,
    chatDirects,
    chatId,
    getMore,
    hasMore,
  }
}
