import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { BaseController } from '@/lib/database'
import { hashingService } from '@/lib/hashing.service'
import { jwtService, TokenType } from '@/lib/jwt.service'
import { redisService } from '@/lib/redis.service'
import { generateSlug } from '@/lib/utils'
import {
  ILoginReqBodyDto,
  IRegisterReqBodyDto,
  IResetPasswordReqBodyDto,
  ISendOtpReqBodyDto,
  IVerifyOtpDto,
} from '@/routes/auth/auth.req.dto'
import { RequestHandler } from 'express'
import { userService } from '../user/user.service'
import { authMaillerService } from './auth-mailler.service'
import { OtpType } from './otp-request.schema'
import { otpService } from './otp.service'

class AuthCtrl extends BaseController {
  private generateOtpAndSendEmail = async (email: string, type: OtpType) => {
    const otp = jwtService.generateOtp(6)
    const now = Date.now()
    const iat = new Date(now)
    const exp = new Date(now + 10 * 60 * 1000) // 10 phút
    await authMaillerService.sendOtpEmail(email, otp, type)
    await otpService.upsert({
      email,
      otp,
      type,
      iat,
      exp,
    })
    return { otp, iat, exp }
  }

  private async verifyEmail(email: string, otp: string, type: OtpType) {
    const result = await otpService.findOneAndDelete({ email, otp, type })
    const exp = new Date(result.exp)
    if (exp < new Date()) throw new NotFoundException('Mã OTP không hợp lệ hoặc đã hết hạn')
    const token = jwtService.signOtpToken({
      email,
      type,
    })
    return token
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

  /**
   * @description Gửi email xác thực đăng ký
   * @todo Cần có rate limit ở tầng middleware nếu không sẽ dễ bị spam
   * @note không  cần làm thêm resend vì client có thể gọi lại endpoint này
   */
  sendVerifyEmailCtrl: RequestHandler<any, any, ISendOtpReqBodyDto> = async (req, res) => {
    const email = req.body.email
    const existingEmail = await userService.findOneByEmail(email)
    if (existingEmail) throw new ConflictException('Email đã được sử dụng')
    await this.generateOtpAndSendEmail(email, OtpType.VerifyEmail)
    return res.status(HttpStatusCode.NoContent).json({})
  }

  verifyEmailCtrl: RequestHandler<any, any, IVerifyOtpDto> = async (req, res) => {
    try {
      const { email, otp } = req.body
      const registerToken = await this.verifyEmail(email, otp, OtpType.VerifyEmail)
      jwtService.setCookieToClient(res, registerToken, TokenType.Otp, 'registerToken')
      return res.status(HttpStatusCode.NoContent).json()
    } catch (error) {
      this.handleNotFoundError(error, 'Mã OTP không hợp lệ hoặc đã hết hạn')
    }
  }

  private revokeAllRefreshTokens = async (userId: string) => {
    const setKey = `userRefreshTokens:${userId}`
    const jtis = await redisService.sMembers(setKey)
    if (!jtis || jtis.length === 0) {
      await redisService.del(setKey)
      return
    }
    const multi = redisService.multi()
    for (const jti of jtis) {
      multi.del(`${jti}`)
    }
    // remove the set itself
    multi.del(setKey)
    await multi.exec()
  }

  registerCtrl: RequestHandler<any, any, IRegisterReqBodyDto> = async (req, res) => {
    try {
      const { password, ...fields } = req.body
      const registerToken = req.cookies['registerToken']
      if (!registerToken) throw new UnauthorizedException('Không tìm thấy register token')
      jwtService.deleteCookieFromClient(res, TokenType.Otp, 'registerToken')
      const { email, type, exp } = jwtService.verifyOtpToken(registerToken)
      if (type !== OtpType.VerifyEmail) throw new UnauthorizedException()
      if (Date.now() >= exp * 1000) throw new UnauthorizedException('Register token đã hết hạn')
      const hashedPassword = await hashingService.hash(password)
      // email và username phải là duy nhất
      const isExistingEmail = await userService.findOneByEmail(email)
      // email lấy thông qua token nên chỉ bị trùng khi client cố ý lấy token đấy gửi lại nên trả lỗi Unauthorized
      const username = generateSlug(fields.username)
      if (isExistingEmail) throw new UnauthorizedException('Email đã được sử dụng')
      const isExistingUsername = await userService.findOneByUsername(username)
      // username tồn tại thì trả về lỗi unprocessable entity với chi tiết lỗi để client hiển thị đúng ở field nào
      if (isExistingUsername)
        throw new UnprocessableEntityException([
          {
            message: 'Username đã được sử dụng',
            path: ['username'],
          },
        ])
      const result = await userService.create({
        ...fields,
        email,
        hashedPassword,
        username,
      })
      const { accessToken, refreshToken } = jwtService.generateTokens({
        email,
        userId: result.id.toString(),
      })
      await this.addRefreshTokenToRedis(refreshToken, result.id.toString())
      jwtService.setCookieToClient(res, refreshToken, TokenType.Refresh)
      return res.status(HttpStatusCode.Created).json({ accessToken })
    } catch (error) {
      // Trường hợn đặc biệt, override lỗi khi verify và tránh mã lỗi 401 để client dễ xử lý
      if (error instanceof UnauthorizedException)
        throw new BadRequestException(undefined, 'Không thể làm mới token, vui lòng thử lại')
      throw error
    }
  }

  loginCtrl: RequestHandler<any, any, ILoginReqBodyDto> = async (req, res) => {
    const { email, password } = req.body
    const result = await userService.findOneByEmail(email)
    if (!result) throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
    const isPasswordValid = await hashingService.compare(password, result.hashedPassword)
    if (!isPasswordValid) throw new UnauthorizedException('Email hoặc mật khẩu không đúng')
    const { accessToken, refreshToken } = jwtService.generateTokens({
      email,
      userId: result.id.toString(),
    })
    await this.addRefreshTokenToRedis(refreshToken, result.id.toString())
    jwtService.setCookieToClient(res, refreshToken, TokenType.Refresh)
    return res.status(HttpStatusCode.Created).json({ accessToken })
  }

  // xem lại docs/refresh-token.flow.md để biết flow chi tiết
  refreshTokenCtrl: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) throw new UnauthorizedException('Không tìm thấy refresh token')
    // 1. Verify jwt
    const { jti, exp, userId, email } = jwtService.verifyRefreshToken(refreshToken)
    // 2. Kiểm tra token có trong redis không
    const storedUserId = await redisService.get(`${jti}`)
    if (!storedUserId)
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã bị thu hồi')
    await redisService.del(`${jti}`)
    // 3. Tạo token mới với thời gian giống token cũ
    const newAccessToken = jwtService.signAccessToken({ userId, email })
    const newRefreshToken = jwtService.signRefreshToken({ userId, email }, exp)
    // 4. Lưu refresh token mới vào redis
    await this.addRefreshTokenToRedis(newRefreshToken, userId)
    // 5. Gửi refresh token mới về client qua cookie
    jwtService.setCookieToClient(res, newRefreshToken, TokenType.Refresh)
    return res.status(HttpStatusCode.Created).json({ accessToken: newAccessToken })
  }

  logoutCtrl: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) throw new UnauthorizedException('Không tìm thấy refresh token')
    jwtService.deleteCookieFromClient(res, TokenType.Refresh)
    const { jti } = jwtService.verifyRefreshToken(refreshToken)
    await redisService.del(`${jti}`)
    return res.status(HttpStatusCode.NoContent).json({})
  }

  logoutAllDeviceCtrl: RequestHandler = async (req, res) => {
    const refreshToken = req.cookies['refreshToken']
    if (!refreshToken) throw new UnauthorizedException('Không tìm thấy refresh token')
    jwtService.deleteCookieFromClient(res, TokenType.Refresh)
    const { userId } = jwtService.verifyRefreshToken(refreshToken)
    await this.revokeAllRefreshTokens(userId)
    return res.status(HttpStatusCode.NoContent).json({})
  }

  sendForgotPasswordOtpCtrl: RequestHandler<any, any, ISendOtpReqBodyDto> = async (req, res) => {
    const email = req.body.email
    const existingEmail = await userService.findOneByEmail(email)
    if (!existingEmail) throw new NotFoundException('Email không tồn tại trong hệ thống')
    await this.generateOtpAndSendEmail(email, OtpType.ResetPasswordReqBodyDto)
    return res.status(HttpStatusCode.NoContent).json({})
  }

  verifyForgotPasswordEmailCtrl: RequestHandler<any, any, IVerifyOtpDto> = async (req, res) => {
    const { email, otp } = req.body
    const forgotPasswordToken = await this.verifyEmail(email, otp, OtpType.ResetPasswordReqBodyDto)
    jwtService.setCookieToClient(res, forgotPasswordToken, TokenType.Otp, 'forgotPasswordToken')
    return res.status(HttpStatusCode.NoContent).json()
  }

  /**
   * @todo Ở đây cần thu hồi forgotPasswordToken sau khi đổi mật khẩu đỡ mất công bị spam nhưng lười code quá
   */
  resetPasswordCtrl: RequestHandler<any, any, IResetPasswordReqBodyDto> = async (req, res) => {
    try {
      const { password } = req.body
      const forgotPasswordToken = req.cookies['forgotPasswordToken']
      if (!forgotPasswordToken)
        throw new UnauthorizedException('Không tìm thấy forgot password token')
      jwtService.deleteCookieFromClient(res, TokenType.Otp, 'forgotPasswordToken')
      const { email, type, exp } = jwtService.verifyOtpToken(forgotPasswordToken)
      if (type !== OtpType.ResetPasswordReqBodyDto) throw new UnauthorizedException()
      if (Date.now() >= exp * 1000)
        throw new UnauthorizedException('Forgot password token đã hết hạn')
      const hashedPassword = await hashingService.hash(password)
      const user = await userService.findOneByEmail(email)
      const { accessToken, refreshToken } = jwtService.generateTokens({
        email,
        userId: user!.id.toString(),
      })
      await this.addRefreshTokenToRedis(refreshToken, user!.id.toString())
      jwtService.setCookieToClient(res, refreshToken, TokenType.Refresh)
      if (!user) throw new NotFoundException('Người dùng không tồn tại')
      const result = await userService.update(user.id.toString(), { hashedPassword })
      if (!result) throw new NotFoundException('Người dùng không tồn tại')
      return res.status(HttpStatusCode.Created).json({ accessToken })
    } catch (error) {
      // Trường hợn đặc biệt, override lỗi khi verify và tránh mã lỗi 401 để client dễ xử lý
      if (error instanceof UnauthorizedException)
        throw new BadRequestException(undefined, 'Không thể làm mới token, vui lòng thử lại')
      throw error
    }
  }
}

export const authCtrl = new AuthCtrl()
