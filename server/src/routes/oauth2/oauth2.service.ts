import { envConfig } from '@/config/env-config'
import { jwtService } from '@/lib/jwt.service'
import { redisService } from '@/lib/redis.service'
import { nanoid } from 'nanoid'
import { UserCollection } from '../user/user.db'
import { userService } from '../user/user.service'

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

class OAuth2Service {
  getGoogleAuthUrl() {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth'
    const serverUri = envConfig.serverUri
    const options = {
      redirect_uri: `${serverUri}/oauth2/google/callback`,
      client_id: envConfig.googleOAuth2.googleClientId,
      response_type: 'code',
      prompt: 'consent',
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
      ].join(' '),
    }
    const qs = new URLSearchParams(options)
    return `${rootUrl}?${qs.toString()}`
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
      // Ignore
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

  async handleGoogleCallback(code: string) {
    const userInfo = await this.handleOAuth2Callback(code)
    const email = userInfo.email
    if (!email) throw new Error('Cannot get email from Google')

    let user = await userService.findOneByEmail(email)
    if (!user) {
      const dataTransform = UserCollection.parse({
        email: userInfo.email,
        avatarUrl: userInfo.picture,
        displayName: userInfo.name,
        username: `google_${nanoid()}`,
        hashedPassword: email,
      })
      user = await userService.create(dataTransform)
    }

    const tokens = jwtService.generateTokens({
      email,
      userId: user.id.toString(),
    })
    await this.addRefreshTokenToRedis(tokens.refreshToken, user.id.toString())
    return { tokens, user, userInfo }
  }
}

export const oauth2Service = new OAuth2Service()
