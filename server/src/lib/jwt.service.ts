import { envConfig } from '@/config/env-config'
import { UnauthorizedException } from '@/core/exceptions'
import { OtpType } from '@/routes/auth/otp-request.schema'
import { Response } from 'express'
import { JsonWebTokenError, sign, verify } from 'jsonwebtoken'
import { nanoid } from 'nanoid'

export enum TokenType {
  Access = 'accessToken',
  Refresh = 'refreshToken',
  Otp = 'otpToken',
}

export interface AccessTokenData {
  userId: string
  email: string
}

export interface TokenMetaData {
  jti: string
  exp: number
  iat: number
}
export interface AccessTokenPayload extends AccessTokenData, TokenMetaData {}

export interface RefreshTokenPayload extends AccessTokenPayload {}
export interface OtpTokenPayload extends TokenMetaData {
  email: string
  type: OtpType
}

const JWT_CONFIG = envConfig.jwt
const DEFAULT_ALGORITHM = 'HS256'
class JwtService {
  generateOtp(length: number): string {
    let otp = ''
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10).toString()
    }
    return otp
  }

  signToken<T>(data: T, tokenType: TokenType, exp?: number): string {
    const { expiresIn, secret } = JWT_CONFIG[tokenType]
    const jti = nanoid() // do token dễ trùng nhau(trong cùng thời gian 1s, 1 user), không cần thiết nếu không dùng để thu hồi token, các trường hợp liên quan đến tính duy nhất của token
    return sign({ ...data, jti }, secret, {
      ...(exp ? { expiresIn: exp - Math.floor(Date.now() / 1000) } : { expiresIn }),
      algorithm: DEFAULT_ALGORITHM,
    })
  }

  verifyToken<T>(token: string, tokenType: TokenType): T {
    try {
      const { secret } = JWT_CONFIG[tokenType]
      return verify(token, secret, {
        algorithms: [DEFAULT_ALGORITHM],
      }) as T
    } catch (error) {
      if (error instanceof JsonWebTokenError) throw new UnauthorizedException(error.message)
      throw new UnauthorizedException('Token không hợp lệ hoặc đã hết hạn')
    }
  }

  signAccessToken(data: AccessTokenData) {
    const { userId, email } = data
    return this.signToken({ userId, email }, TokenType.Access)
  }

  signRefreshToken(data: AccessTokenData, exp?: number) {
    const { userId, email } = data
    return this.signToken({ userId, email }, TokenType.Refresh, exp)
  }

  signOtpToken(data: { email: string; type: OtpType }) {
    const { email, type } = data
    return this.signToken({ email, type }, TokenType.Otp)
  }

  verifyAccessToken(token: string) {
    return this.verifyToken<AccessTokenPayload>(token, TokenType.Access)
  }

  verifyRefreshToken(token: string) {
    return this.verifyToken<RefreshTokenPayload>(token, TokenType.Refresh)
  }

  verifyOtpToken(token: string) {
    return this.verifyToken<OtpTokenPayload>(token, TokenType.Otp)
  }

  /**
   *
   * @description Tạo access token và refresh token lần đầu khi đăng nhập
   */
  generateTokens(data: AccessTokenData) {
    const accessToken = this.signAccessToken(data)
    const refreshToken = this.signRefreshToken(data)
    return { accessToken, refreshToken }
  }

  /**   *
   * @description Tạo access token mới từ refresh token, đặt thời gian của refresh token mới băng với refresh token cũ
   */
  refreshAccessToken(refreshToken: string) {
    const { exp, ...data } = this.verifyRefreshToken(refreshToken)
    const newAccessToken = this.signAccessToken(data)
    const newRefreshToken = this.signRefreshToken(data, exp)
    return { accessToken: newAccessToken, refreshToken: newRefreshToken }
  }

  setCookieToClient(res: Response, token: string, tokenType: TokenType, tokenKey?: string) {
    const isSecure = envConfig.clientUri.startsWith('https')
    const cookieOptions = {
      httpOnly: true,
      secure: isSecure,
      sameSite: 'strict' as const, // todo: Nếu để
      maxAge: JWT_CONFIG[tokenType].expiresIn * 1000,
    }
    res.cookie(tokenKey ?? tokenType, token, cookieOptions)
  }

  deleteCookieFromClient(res: Response, tokenType: TokenType, tokenKey?: string) {
    res.clearCookie(tokenKey ?? tokenType)
  }
}

export const jwtService = new JwtService()
