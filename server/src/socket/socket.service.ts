import { getSocketByUserId } from './socket.init'

class SocketService {
  joinChat(chatId: string, userIds: string[]) {
    userIds.forEach((userId) => {
      const socket = getSocketByUserId(userId)
      if (socket) {
        socket.join(chatId)
      }
    })
  }
}

export const socketService = new SocketService()
