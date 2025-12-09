import { BadRequestException, UnauthorizedException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { BaseController } from '@/lib/database'
import { jwtService, TokenType } from '@/lib/jwt.service'
import {
  ILoginReqBodyDto,
  IRegisterReqBodyDto,
  IResetPasswordReqBodyDto,
  ISendOtpReqBodyDto,
  IVerifyOtpDto,
} from '@/routes/auth/auth.req.dto'
import { RequestHandler } from 'express'
import { AccessTokenResDto, SuccessResDto } from './auth.res.dto'
import { authService } from './auth.service'

class AuthCtrl extends BaseController {
  sendVerifyEmailCtrl: RequestHandler<any, any, ISendOtpReqBodyDto> = async (req, res) => {
    const email = req.body.email
    await authService.sendVerifyEmail(email)
    return res.status(HttpStatusCode.NoContent).json(SuccessResDto.parse({}))
  }

  verifyEmailCtrl: RequestHandler<any, any, IVerifyOtpDto> = async (req, res) => {
    try {
      const { email, otp } = req.body
      const registerToken = await authService.verifyEmail(email, otp)
      jwtService.setCookieToClient(res, registerToken, TokenType.Otp, 'registerToken')
      return res.status(HttpStatusCode.NoContent).json(SuccessResDto.parse({}))
    } catch (error) {
      this.handleNotFoundError(error, 'Mã OTP không hợp lệ hoặc đã hết hạn')
    }
  }

  registerCtrl: RequestHandler<any, any, IRegisterReqBodyDto> = async (req, res) => {
    try {
      const { password, ...fields } = req.body
      const registerToken = req.cookies['registerToken']
      if (!registerToken) throw new UnauthorizedException('Không tìm thấy register token')

      const { accessToken, refreshToken } = await authService.register(
        registerToken,
        fields,
        password,
      )

      jwtService.deleteCookieFromClient(res, TokenType.Otp, 'registerToken')
      jwtService.setCookieToClient(res, refreshToken, TokenType.Refresh)
      return res.status(HttpStatusCode.Created).json(AccessTokenResDto.parse({ accessToken }))
    } catch (error) {
      if (error instanceof UnauthorizedException)
        throw new BadRequestException(undefined, 'Không thể làm mới token, vui lòng thử lại')
      throw error
    }
  }

  loginCtrl: RequestHandler<any, any, ILoginReqBodyDto> = async (req, res) => {
    const { email, password } = req.body
    const { accessToken, refreshToken } = await authService.login(email, password)
    jwtService.setCookieToClient(res, refreshToken, TokenType.Refresh)
    return res.status(HttpStatusCode.Created).json(AccessTokenResDto.parse({ accessToken }))
  }

  refreshTokenCtrl: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) throw new UnauthorizedException('Không tìm thấy refresh token')

    const { accessToken, refreshToken: newRefreshToken } =
      await authService.refreshToken(refreshToken)

    jwtService.setCookieToClient(res, newRefreshToken, TokenType.Refresh)
    return res.status(HttpStatusCode.Created).json(AccessTokenResDto.parse({ accessToken }))
  }

  logoutCtrl: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) throw new UnauthorizedException('Không tìm thấy refresh token')
    jwtService.deleteCookieFromClient(res, TokenType.Refresh)
    await authService.logout(refreshToken)
    return res.status(HttpStatusCode.NoContent).json(SuccessResDto.parse({}))
  }

  logoutAllDeviceCtrl: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) throw new UnauthorizedException('Không tìm thấy refresh token')
    jwtService.deleteCookieFromClient(res, TokenType.Refresh)
    await authService.logoutAllDevices(refreshToken)
    return res.status(HttpStatusCode.NoContent).json(SuccessResDto.parse({}))
  }

  sendForgotPasswordOtpCtrl: RequestHandler<any, any, ISendOtpReqBodyDto> = async (req, res) => {
    const email = req.body.email
    await authService.sendForgotPasswordOtp(email)
    return res.status(HttpStatusCode.NoContent).json(SuccessResDto.parse({}))
  }

  verifyForgotPasswordEmailCtrl: RequestHandler<any, any, IVerifyOtpDto> = async (req, res) => {
    const { email, otp } = req.body
    const forgotPasswordToken = await authService.verifyForgotPasswordOtp(email, otp)
    jwtService.setCookieToClient(res, forgotPasswordToken, TokenType.Otp, 'forgotPasswordToken')
    return res.status(HttpStatusCode.NoContent).json(SuccessResDto.parse({}))
  }

  resetPasswordCtrl: RequestHandler<any, any, IResetPasswordReqBodyDto> = async (req, res) => {
    try {
      const { password } = req.body
      const forgotPasswordToken = req.cookies['forgotPasswordToken']
      if (!forgotPasswordToken)
        throw new UnauthorizedException('Không tìm thấy forgot password token')

      const { accessToken, refreshToken } = await authService.resetPassword(
        forgotPasswordToken,
        password,
      )

      jwtService.deleteCookieFromClient(res, TokenType.Otp, 'forgotPasswordToken')
      jwtService.setCookieToClient(res, refreshToken, TokenType.Refresh)
      return res.status(HttpStatusCode.Created).json(AccessTokenResDto.parse({ accessToken }))
    } catch (error) {
      if (error instanceof UnauthorizedException)
        throw new BadRequestException(undefined, 'Không thể làm mới token, vui lòng thử lại')
      throw error
    }
  }
}

export const authCtrl = new AuthCtrl()
