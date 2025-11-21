import { UnauthorizedException } from '@/core/exceptions'
import { jwtService } from '@/lib/jwt.service'
import { RequestHandler } from 'express'
import { Socket } from 'socket.io'

export const accessTokenValidate: RequestHandler = (req, res, next) => {
  const authHeader = req.headers['authorization']
  if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedException()
  const token = authHeader.split(' ')[1]
  const payload = jwtService.verifyAccessToken(token)
  req.user = payload
  next()
}

/**
 * @description Kiểm tra và xác thực access token từ socket handshake, chưa clean code với middleware express
 */
export const authenticateSocket = (socket: Socket, next: (err?: Error | undefined) => void) => {
  try {
    const authHeader = socket.handshake.auth['Authorization']
    if (!authHeader || !authHeader.startsWith('Bearer ')) throw new UnauthorizedException()
    const token = authHeader.split(' ')[1]
    const payload = jwtService.verifyAccessToken(token)
    socket.data.user = payload
    next()
  } catch (error) {
    return next(new Error('Unauthorized'))
  }
}
