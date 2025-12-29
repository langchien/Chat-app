import { IParticipant } from '@/routes/chat/chat.db'
import { IChatResDto } from '@/routes/chat/chat.res.dto'
import { IMediaResDto } from '@/routes/media/media.res'
import { IMessageResDto } from '@/routes/message/message.res.dto'
import { SOCKET_EVENTS } from './event.const'
import { getSocketByUserId, io } from './socket.init'

export interface IMemberAddedPayload {
  chatId: string
  participants: IParticipant[]
}

export interface IMemberRemovedPayload {
  chatId: string
  userId: string
}

export interface INotificationPayload {
  id: string
  // Add other notification fields as needed or use the full Notification model type
  [key: string]: any
}

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

  memberAdded(chatId: string, participants: IParticipant[]) {
    const payload: IMemberAddedPayload = { chatId, participants }
    io.to(chatId).emit(SOCKET_EVENTS.MEMBER_ADDED, payload)
  }

  memberRemoved(chatId: string, userId: string) {
    const payload: IMemberRemovedPayload = { chatId, userId }
    io.to(chatId).emit(SOCKET_EVENTS.MEMBER_REMOVED, payload)
  }

  sendNotification(userId: string, notification: any) {
    io.to(userId).emit(SOCKET_EVENTS.NEW_NOTIFICATION, notification)
  }
}

export const socketService = new SocketService()
