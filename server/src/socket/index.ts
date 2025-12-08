import { envConfig } from '@/config/env-config'
import { authenticateSocket } from '@/core/access-token.middleware'
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

  io.use(authenticateSocket)

  io.on('connection', async (socket) => {
    // socket.use((_, next) => {
    //   authenticateSocket(socket, next)
    // })
    const { userId }: AccessTokenPayload = socket.data.user
    // Xử lý chức năng online users
    onlineUsers.set(userId, socket.id)
    io.emit(SOCKET_EVENTS.ONLINE_USERS, Array.from(onlineUsers.keys()))
    socket.on('disconnect', () => {
      onlineUsers.delete(userId)
      io.emit(SOCKET_EVENTS.ONLINE_USERS, Array.from(onlineUsers.keys()))
    })
    // Chức năng join các room chat của user
    const allChat = await chatService.getAllChatsByUserId(userId)
    allChat.forEach((chat) => {
      socket.join(chat.id)
    })
    socket.on('disconnect', () => {
      allChat.forEach((chat) => {
        socket.leave(chat.id)
      })
    })
  })
  return { io, httpServer, app }
}

export const { io, httpServer, app } = initSocketService()
