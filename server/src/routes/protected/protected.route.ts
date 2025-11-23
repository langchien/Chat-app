import { accessTokenValidate } from '@/core/access-token.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { protectedCtrl } from './protected.ctrl'
import { ChangePassworBodyDto, UpdateProfileBodyDto } from './protected.dto'

export const protectedRouter = Router()

protectedRouter.get('/profile', accessTokenValidate, protectedCtrl.getProfile)

protectedRouter.patch(
  '/profile',
  accessTokenValidate,
  zodValidate(UpdateProfileBodyDto),
  protectedCtrl.updateProfile,
)

protectedRouter.post(
  '/change-password',
  accessTokenValidate,
  zodValidate(ChangePassworBodyDto),
  protectedCtrl.changePassword,
)
