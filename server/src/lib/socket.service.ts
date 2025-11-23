import { chatRepo } from '@/routes/chat/chat.repo'
import { messageRepo } from '@/routes/message/message.repo'
import { ICreateMessageBodyDto } from '@/routes/message/message.req.dto'
import { userRepo } from '@/routes/user/user.repo'
import { IUserResDto, UserResDto } from '@/routes/user/user.res.dto'
import { Server as HttpServer } from 'http'
import { Server } from 'socket.io'
import { authenticateSocket } from '../core/access-token.middleware'
import { AccessTokenPayload } from './jwt.service'

export const initSocketService = (httpServer: HttpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  })
  io.use(authenticateSocket)

  io.on('connection', async (socket) => {
    // socket.use((_, next) => {
    //   authenticateSocket(socket, next)
    // })
    const { userId: senderId }: AccessTokenPayload = socket.data.user

    const dbUser = await userRepo.findOneById(senderId)
    if (!dbUser) throw new Error('User not found')
    const sender: IUserResDto = UserResDto.parse(dbUser)

    // Thêm user vào các room tương ứng với các cuộc trò chuyện của họ
    socket.on('join_chats', (payload: { chatIds: string[] }) => {
      const { chatIds } = payload
      if (Array.isArray(chatIds)) {
        chatIds.forEach((chatId) => {
          socket.join(chatId)
        })
      }
    })
    // leave room khi ng dùng rời khỏi cuộc trò chuyện
    socket.on('leave_chats', (payload: { chatIds: string[] }) => {
      const { chatIds } = payload
      if (Array.isArray(chatIds)) {
        chatIds.forEach((chatId) => {
          socket.leave(chatId)
        })
      }
    })

    socket.on('private_message', async (payload: ICreateMessageBodyDto) => {
      const [messageCreated] = await Promise.all([
        messageRepo.create(payload),
        chatRepo.update(payload.chatId, {
          lastMessage: payload.text,
        }),
      ])
      io.to(payload.chatId).emit('receive_private_message', messageCreated)
    })
    socket.on('disconnect', () => {})
  })
}
