import { accessTokenValidate } from '@/core/access-token.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { protectedCtrl } from './protected.ctrl'
import { ChangePassworSchema, UpdateProfileSchema } from './protected.dto'

export const protectedRouter = Router()

protectedRouter.get('/profile', accessTokenValidate, protectedCtrl.getProfile)

protectedRouter.patch(
  '/profile',
  accessTokenValidate,
  zodValidate(UpdateProfileSchema),
  protectedCtrl.updateProfile,
)

protectedRouter.post(
  '/change-password',
  accessTokenValidate,
  zodValidate(ChangePassworSchema),
  protectedCtrl.changePassword,
)
