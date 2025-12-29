import { IChatResDto } from '@/routes/chat/chat.res.dto'
import { IMediaResDto } from '@/routes/media/media.res'
import { IMessageResDto } from '@/routes/message/message.res.dto'
import { SOCKET_EVENTS } from './event.const'
import { getSocketByUserId, io } from './socket.init'

// gom hết các io.emit vào đây, để dễ dàng quản lý, debug
class SocketService {
  joinChat(chatId: string, userIds: string[]) {
    userIds.forEach((userId) => {
      const socket = getSocketByUserId(userId)
      if (socket) {
        socket.join(chatId)
      }
    })
  }

  updateChat(chatId: string, chat: IChatResDto) {
    io.to(chatId).emit(SOCKET_EVENTS.UPDATE_CHAT, chat)
  }

  deleteChat(chatId: string) {
    io.to(chatId).emit(SOCKET_EVENTS.DELETE_CHAT, { chatId })
  }

  sendMessage(
    chatId: string,
    payload: {
      message: IMessageResDto
      chat: IChatResDto
    },
  ) {
    io.to(chatId).emit(SOCKET_EVENTS.RECEIVE_MESSAGE, payload)
  }

  unfriend(userId: string, toUserId: string) {
    io.to(userId).emit(SOCKET_EVENTS.UNFRIEND, toUserId)
    io.to(toUserId).emit(SOCKET_EVENTS.UNFRIEND, userId)
  }

  mediaProcessingUpdate(chatId: string, message: IMediaResDto) {
    io.to(chatId).emit(SOCKET_EVENTS.MEDIA_PROCESSING_UPDATE, message)
  }
}

export const socketService = new SocketService()
