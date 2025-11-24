import { accessTokenValidate } from '@/core/access-token.middleware'
import { emailRateLimiter } from '@/core/rate-limit.middleware'
import { zodValidate } from '@/core/validate.middleware'
import {
  LoginReqBodyDto,
  RegisterReqBodyDto,
  ResetPasswordReqBodyDto,
  SendOtpReqBodyDto,
  VerifyOtp,
} from '@/routes/auth/auth.req.dto'
import { Router } from 'express'
import { authCtrl } from './auth.ctrl'

export const authRouter = Router()
authRouter.post(
  '/send-verify-email',
  emailRateLimiter,
  zodValidate(SendOtpReqBodyDto),
  authCtrl.sendVerifyEmailCtrl,
)

authRouter.post('/verify-email', zodValidate(VerifyOtp), authCtrl.verifyEmailCtrl)

authRouter.post('/register', zodValidate(RegisterReqBodyDto), authCtrl.registerCtrl)

authRouter.post('/login', zodValidate(LoginReqBodyDto), authCtrl.loginCtrl)

authRouter.post('/refresh-token', authCtrl.refreshTokenCtrl)

authRouter.post(
  '/logout',
  accessTokenValidate,

  authCtrl.logoutCtrl,
)

authRouter.post(
  '/logout-all-devices',
  accessTokenValidate,

  authCtrl.logoutAllDeviceCtrl,
)

authRouter.post(
  '/password/send-verify-email',
  emailRateLimiter,
  zodValidate(SendOtpReqBodyDto),
  authCtrl.sendForgotPasswordOtpCtrl,
)

authRouter.post(
  '/password/verify-email',
  zodValidate(VerifyOtp),
  authCtrl.verifyForgotPasswordEmailCtrl,
)

authRouter.post('/password/reset', zodValidate(ResetPasswordReqBodyDto), authCtrl.resetPasswordCtrl)
