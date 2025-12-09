import { envConfig } from '@/config/env-config'
import { jwtService, TokenType } from '@/lib/jwt.service'
import { RequestHandler } from 'express'
import { oauth2Service } from './oauth2.service'

export interface GoogleOAuth2CallbackQuery {
  code: string
  scope: string
  authuser: string
  prompt: string
}

export class OAuth2Ctrl {
  getOAuth2RedirectUrl: RequestHandler = (req, res) => {
    const url = oauth2Service.getGoogleAuthUrl()
    res.json({ url })
  }

  getGoogleOAuth2Callback: RequestHandler<any, any, any, GoogleOAuth2CallbackQuery> = async (
    req,
    res,
  ) => {
    try {
      const code = req.query.code
      const { appClientRedirectUri } = envConfig.googleOAuth2
      if (!code) return res.status(400).json({ error: 'Missing authorization code' })

      const { tokens } = await oauth2Service.handleGoogleCallback(code)

      jwtService.setCookieToClient(res, tokens.refreshToken, TokenType.Refresh)
      return res.redirect(
        `${appClientRedirectUri}/?status=success&accessToken=${tokens.accessToken}`,
      )
    } catch (error) {
      return res.redirect(`${envConfig.googleOAuth2.appClientRedirectUri}?status=error`)
    }
  }
}

export const oauth2Ctrl = new OAuth2Ctrl()
