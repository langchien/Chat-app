import { envConfig } from '@/config/env-config'
import { authenticateSocket } from '@/core/access-token.middleware'
import { AccessTokenPayload } from '@/lib/jwt.service'
import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'

const initSocketService = () => {
  const app = express()
  const httpServer = createServer(app)
  const io = new Server(httpServer, {
    cors: {
      origin: envConfig.clientUri,
      credentials: true,
    },
  })
  io.use(authenticateSocket)

  io.on('connection', async (socket) => {
    // socket.use((_, next) => {
    //   authenticateSocket(socket, next)
    // })
    const { userId }: AccessTokenPayload = socket.data.user
    socket.on('disconnect', () => {})
  })
  return { io, httpServer, app }
}

export const { io, httpServer, app } = initSocketService()
