import { Router } from 'express'
import { oauth2Ctrl } from './oauth2.controller'

export const oauth2Router = Router()

oauth2Router.get('/google', oauth2Ctrl.getOAuth2RedirectUrl)

oauth2Router.get('/google/callback', oauth2Ctrl.getGoogleOAuth2Callback)
