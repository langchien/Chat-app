import { envConfig } from '@/config/env-config'
import { jwtService, TokenType } from '@/lib/jwt.service'
import { redisService } from '@/lib/redis.service'
import { RequestHandler } from 'express'
import { nanoid } from 'nanoid'
import { UserCollection } from '../user/user.db'
import { userRepo } from '../user/user.repo'

export interface GoogleOAuth2CallbackQuery {
  code: string
  scope: string
  authuser: string
  prompt: string
}

export interface GoogleOAuth2TokenResponse {
  access_token: string
  expires_in: number
  refresh_token: string
  scope: string
  token_type: string
  id_token: string
}

export interface GoogleUserInfoResponse {
  sub: string
  name: string
  given_name: string
  family_name: string
  picture: string
  email: string
  email_verified: boolean
}

/**
 * @description OAuth 2.0 Ctrlđể xử lý các yêu cầu liên quan đến OAuth 2.0
 * @reference https://developers.google.com/identity/protocols/oauth2/web-server?hl=vi
 */
export class OAuth2Ctrl {
  /**
   * @step1: Bước 1: Chuyển hướng đến máy chủ OAuth 2.0 của Google để người dùng ủy quyền
   */
  getOAuth2RedirectUrl: RequestHandler = (req, res) => {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const serverUri = envConfig.serverUri
    const options = {
      redirect_uri: `${serverUri}/oauth2/google/callback`,
      client_id: envConfig.googleOAuth2.googleClientId,
      response_type: 'code', // ở client thì dùng 'token' để lấy access token luôn
      prompt: 'consent',
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    }
    const qs = new URLSearchParams(options)
    const result = `${rootUrl}?${qs.toString()}`
    res.json({ url: result })
  }

  private async postForm<T>(url: string, params: Record<string, string>) {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(params).toString(),
    })
    const json: T = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, body: json }
  }

  private addRefreshTokenToRedis = async (refreshToken: string, userId: string) => {
    const { jti, exp } = jwtService.verifyRefreshToken(refreshToken)
    const ttl = exp - Math.floor(Date.now() / 1000)
    await redisService.set(`${jti}`, userId, ttl)
    await redisService.sAdd(`userRefreshTokens:${userId}`, jti)
    try {
      await redisService.expireAt(`userRefreshTokens:${userId}`, exp)
    } catch (e) {
      // Lỗi không nghiêm trọng: nếu expireAt thất bại, không sao — set vẫn còn và có thể được dọn dẹp sau
    }
  }

  private handleOAuth2Callback = async (code: string) => {
    const tokenUrl = 'https://oauth2.googleapis.com/token'
    const redirect_uri = `${envConfig.serverUri}/oauth2/google/callback`
    const tokenBody = await this.postForm<GoogleOAuth2TokenResponse>(tokenUrl, {
      code,
      client_id: envConfig.googleOAuth2.googleClientId,
      client_secret: envConfig.googleOAuth2.googleClientSecret,
      redirect_uri,
      grant_type: 'authorization_code',
    })
    const accessToken = tokenBody.body.access_token
    const userRes = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      method: 'GET',
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    const userInfo: GoogleUserInfoResponse = await userRes.json().catch(() => ({}))
    return userInfo
  }

  /**
   * @description Ở đây hoàn toàn có thể tạo tài khoản luôn nếu chưa có thay vì trả về registerToken nhưng muốn thử nghiệm luồng đăng ký nên tách ra vậy
   */
  getGoogleOAuth2Callback: RequestHandler<any, any, any, GoogleOAuth2CallbackQuery> = async (
    req,
    res,
  ) => {
    try {
      const code = req.query.code
      const { appClientRedirectUri } = envConfig.googleOAuth2
      // todo: xử lý lỗi từ Google OAuth2
      if (!code) return res.status(400).json({ error: 'Missing authorization code' })
      const userInfo = await this.handleOAuth2Callback(code)
      const email = userInfo.email
      const result = await userRepo.findOneByEmail(email)
      if (!result) {
        const dataTransform = UserCollection.parse({
          email: userInfo.email,
          avatarUrl: userInfo.picture,
          displayName: userInfo.name,
          username: `google_${nanoid()}`,
          hashedPassword: email,
        })
        const newUser = await userRepo.create(dataTransform)
        const tokens = jwtService.generateTokens({
          email,
          userId: newUser.id.toString(),
        })
        jwtService.setCookieToClient(res, tokens.refreshToken, TokenType.Refresh)
        await this.addRefreshTokenToRedis(tokens.refreshToken, newUser.id.toString())
        return res.redirect(
          `${appClientRedirectUri}/?status=success&accessToken=${tokens.accessToken}`,
        )
      }
      const tokens = jwtService.generateTokens({
        email,
        userId: result.id.toString(),
      })
      jwtService.setCookieToClient(res, tokens.refreshToken, TokenType.Refresh)
      await this.addRefreshTokenToRedis(tokens.refreshToken, result.id.toString())
      return res.redirect(
        `${appClientRedirectUri}/?status=success&accessToken=${tokens.accessToken}`,
      )
    } catch (error) {
      return res.redirect(`${envConfig.googleOAuth2.appClientRedirectUri}?status=error`)
    }
  }
}

export const oauth2Ctrl = new OAuth2Ctrl()
