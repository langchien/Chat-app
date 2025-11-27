import { UnauthorizedException } from '@/core/exceptions'
import { jwtService } from '@/lib/jwt.service'
import { RequestHandler } from 'express'
import { Socket } from 'socket.io'

const verifyAndDecodeToken = (authHeader: string | undefined) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedException('Token is missing or invalid')
  }
  const token = authHeader.split(' ')[1]
  return jwtService.verifyAccessToken(token)
}

export const accessTokenValidate: RequestHandler = (req, res, next) => {
  try {
    const payload = verifyAndDecodeToken(req.headers['authorization'])
    req.user = payload
    next()
  } catch (error) {
    next(error)
  }
}

/**
 * @description Middleware to authenticate socket connection using access token from handshake.
 */
export const authenticateSocket = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const payload = verifyAndDecodeToken(socket.handshake.auth['Authorization'])
    socket.data.user = payload
    next()
  } catch (error) {
    // For socket.io, we pass the error in the next callback
    return next(new UnauthorizedException('Authentication error'))
  }
}
