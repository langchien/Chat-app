import { SOCKET_EVENTS } from '@/constants/event.const'
import type { clientLoader } from '@/features/chat/pages/chat'
import { messageRequest } from '@/features/message/services'
import { useAuthStore } from '@/stores/auth.store'
import { useSocketStore } from '@/stores/socket.store'
import type { IChat, IMessage, IMessagePaginate, IUser } from '@/types/api.types'
import { useCallback, useEffect, useState } from 'react'
import { useLoaderData } from 'react-router'

const DEFAULT_PAGINATION_LIMIT = 20
export function useChatWindow(paginateMessages: IMessagePaginate) {
  const { chat } = useLoaderData<typeof clientLoader>()
  const socket = useSocketStore((state) => state.socket)
  const [messages, setMessages] = useState(paginateMessages.data)
  const [hasMore, setHasMore] = useState(paginateMessages.hasMore)
  const [nextCursor, setNextCursor] = useState(paginateMessages.nextCursor)
  useEffect(() => {
    if (!socket) return
    const handleReceiveMessage = (payload: { message: IMessage; chat: IChat }) => {
      if (payload.chat.id !== chat.id) return
      setMessages((prevMessages) => [payload.message, ...prevMessages])
    }
    socket.on(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
    return () => {
      socket.off(SOCKET_EVENTS.RECEIVE_MESSAGE, handleReceiveMessage)
    }
  }, [socket, chat.id])
  const allUserInChat = chat.participants.map((p) => p.user)
  const mapUserById = new Map<string, IUser>(allUserInChat.map((user) => [user.id, user]))
  const user = useAuthStore((state) => state.user)
  const userId = user?.id
  const fetchData = useCallback(async () => {
    if (!nextCursor) return
    const response = await messageRequest.paginateMessagesByChatId(chat.id, {
      limit: DEFAULT_PAGINATION_LIMIT,
      cursor: nextCursor,
    })
    setMessages((prevMessages) => [...prevMessages, ...response.data])
    setNextCursor(response.nextCursor)
    setHasMore(response.hasMore)
  }, [nextCursor, chat.id])

  return {
    messages,
    hasMore,
    fetchData,
    userId,
    mapUserById,
    chat,
  }
}
