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

    // --- Media Call Signaling ---
    socket.on(SOCKET_EVENTS.CALL_USER, async ({ to, offer, isVideo }) => {
      const targetSocketId = onlineUsers.get(to)
      if (targetSocketId) {
        // Fetch full user info to display on receiver side (IncomingCall modal)
        const callerInfo = await prismaService.user.findUnique({
          where: { id: userId },
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        })

        io.to(targetSocketId).emit(SOCKET_EVENTS.CALL_MADE, {
          offer,
          socket: socket.id,
          from: userId, // Caller User ID
          user: callerInfo || socket.data.user, // Fallback to token payload if db fail
          isVideo,
        })
      }
    })

    socket.on(SOCKET_EVENTS.MAKE_ANSWER, ({ to, answer }) => {
      const targetSocketId = onlineUsers.get(to)
      if (targetSocketId) {
        io.to(targetSocketId).emit(SOCKET_EVENTS.ANSWER_MADE, {
          answer,
          socket: socket.id,
          from: userId,
        })
      }
    })

    socket.on(SOCKET_EVENTS.ICE_CANDIDATE, ({ to, candidate }) => {
      const targetSocketId = onlineUsers.get(to)
      if (targetSocketId) {
        io.to(targetSocketId).emit(SOCKET_EVENTS.ICE_CANDIDATE, {
          candidate,
          from: userId,
        })
      }
    })

    socket.on(SOCKET_EVENTS.HANG_UP, ({ to }) => {
      const targetSocketId = onlineUsers.get(to)
      if (targetSocketId) {
        io.to(targetSocketId).emit(SOCKET_EVENTS.HANG_UP, {
          from: userId,
        })
      }
    })
    socket.on(SOCKET_EVENTS.CALL_REJECTED, ({ to }) => {
      const targetSocketId = onlineUsers.get(to)
      if (targetSocketId) {
        io.to(targetSocketId).emit(SOCKET_EVENTS.CALL_REJECTED, {
          from: userId,
        })
      }
    })
  })
  return { io, httpServer, app, getSocketByUserId }
}

export const { io, httpServer, app, getSocketByUserId } = initSocketService()
