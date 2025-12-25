import { envConfig } from '@/config/env-config'
import { authenticateSocket } from '@/core/access-token.middleware'
import { prismaService } from '@/lib/database'
import { AccessTokenPayload } from '@/lib/jwt.service'
import { chatService } from '@/routes/chat/chat.service'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import { SOCKET_EVENTS } from './event.const'

const initSocketService = () => {
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: envConfig.clientUri,
      credentials: true,
    },
  })
  // todo: Nên dùng redis để lưu trữ danh sách user online
  const onlineUsers = new Map<string, string>()
  const getSocketByUserId = (userId: string) => {
    const socketId = onlineUsers.get(userId)
    if (!socketId) return null
    return io.sockets.sockets.get(socketId)
  }
  io.use(authenticateSocket)

  io.on('connection', async (socket) => {
    // socket.use((_, next) => {
    //   authenticateSocket(socket, next)
    // })
    const { userId }: AccessTokenPayload = socket.data.user
    // Join room theo userId để server có thể emit event tới user cụ thể
    socket.join(userId)
    // Xử lý chức năng online users
    onlineUsers.set(userId, socket.id)
    io.emit(SOCKET_EVENTS.ONLINE_USERS, Array.from(onlineUsers.keys()))
    socket.on('disconnect', () => {
      onlineUsers.delete(userId)
      io.emit(SOCKET_EVENTS.ONLINE_USERS, Array.from(onlineUsers.keys()))
    })
    // Chức năng join các room chat của user
    const allChat = await prismaService.chat.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
      },
    })
    allChat.forEach((chat) => {
      socket.join(chat.id)
    })
    socket.on('disconnect', () => {
      allChat.forEach((chat) => {
        socket.leave(chat.id)
      })
    })

    socket.on(SOCKET_EVENTS.DELETE_CONVERSATION, async ({ chatId }) => {
      await chatService.deleteConversation(chatId, userId)
      io.to(userId).emit(SOCKET_EVENTS.CONVERSATION_DELETED, {
        chatId,
        deletedAt: new Date(),
      })
    })
  })
  return { io, httpServer, app, getSocketByUserId }
}

export const { io, httpServer, app, getSocketByUserId } = initSocketService()
