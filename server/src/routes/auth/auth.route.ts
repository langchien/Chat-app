import { accessTokenValidate } from '@/core/access-token.middleware'
import { emailRateLimiter } from '@/core/rate-limit.middleware'
import { zodValidate } from '@/core/validate.middleware'
import {
  ForgotPasswordSchema,
  LoginSchema,
  RefreshTokenSchema,
  RegisterSchema,
  SendOtpSchema,
  VerifyOtpSchema,
} from '@/routes/auth/auth.dto'
import { Router } from 'express'
import { authCtrl } from './auth.ctrl'

export const authRouter = Router()
authRouter.post(
  '/send-verify-email',
  emailRateLimiter,
  zodValidate(SendOtpSchema),
  authCtrl.sendVerifyEmailCtrl,
)

authRouter.post('/verify-email', zodValidate(VerifyOtpSchema), authCtrl.verifyEmailCtrl)

authRouter.post('/register', zodValidate(RegisterSchema), authCtrl.registerCtrl)

authRouter.post('/login', zodValidate(LoginSchema), authCtrl.loginCtrl)

authRouter.post('/refresh-token', zodValidate(RefreshTokenSchema), authCtrl.refreshTokenCtrl)

authRouter.post(
  '/logout',
  accessTokenValidate,
  zodValidate(RefreshTokenSchema),
  authCtrl.logoutCtrl,
)

authRouter.post(
  '/logout-all-devices',
  accessTokenValidate,
  zodValidate(RefreshTokenSchema),
  authCtrl.logoutAllDeviceCtrl,
)

authRouter.post(
  '/password/send-verify-email',
  emailRateLimiter,
  zodValidate(SendOtpSchema),
  authCtrl.sendForgotPasswordOtpCtrl,
)

authRouter.post(
  '/password/verify-email',
  zodValidate(VerifyOtpSchema),
  authCtrl.verifyForgotPasswordEmailCtrl,
)

authRouter.post('/password/reset', zodValidate(ForgotPasswordSchema), authCtrl.resetPasswordCtrl)
