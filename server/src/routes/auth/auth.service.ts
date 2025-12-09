import {
  ConflictException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@/core/exceptions'
import { hashingService } from '@/lib/hashing.service'
import { jwtService } from '@/lib/jwt.service'
import { redisService } from '@/lib/redis.service'
import { generateSlug } from '@/lib/utils'
import { userService } from '../user/user.service'
import { authMaillerService } from './auth-mailler.service'
import { IRegisterReqBodyDto } from './auth.req.dto'
import { OtpType } from './otp-request.schema'
import { otpService } from './otp.service'

class AuthService {
  async generateOtpAndSendEmail(email: string, type: OtpType) {
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

  async verifyEmailOtp(email: string, otp: string, type: OtpType) {
    const result = await otpService.findOneAndDelete({ email, otp, type })
    const exp = new Date(result.exp)
    if (exp < new Date()) throw new NotFoundException('Mã OTP không hợp lệ hoặc đã hết hạn')
    const token = jwtService.signOtpToken({
      email,
      type,
    })
    return token
  }

  async addRefreshTokenToRedis(refreshToken: string, userId: string) {
    const { jti, exp } = jwtService.verifyRefreshToken(refreshToken)
    const ttl = exp - Math.floor(Date.now() / 1000)
    await redisService.set(`${jti}`, userId, ttl)
    await redisService.sAdd(`userRefreshTokens:${userId}`, jti)
    try {
      await redisService.expireAt(`userRefreshTokens:${userId}`, exp)
    } catch (e) {
      // Lỗi không nghiêm trọng
    }
  }

  async revokeAllRefreshTokens(userId: string) {
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

  async sendVerifyEmail(email: string) {
    const existingEmail = await userService.findOneByEmail(email)
    if (existingEmail) throw new ConflictException('Email đã được sử dụng')
    await this.generateOtpAndSendEmail(email, OtpType.VerifyEmail)
  }

  async verifyEmail(email: string, otp: string) {
    const token = await this.verifyEmailOtp(email, otp, OtpType.VerifyEmail)
    return token
  }

  async register(
    registerToken: string,
    fields: Omit<IRegisterReqBodyDto, 'password'> & { password?: string },
    passwordRaw: string,
  ) {
    const { email, type, exp } = jwtService.verifyOtpToken(registerToken)
    if (type !== OtpType.VerifyEmail) throw new UnauthorizedException()
    if (Date.now() >= exp * 1000) throw new UnauthorizedException('Register token đã hết hạn')

    // Check duplication again just in case
    const isExistingEmail = await userService.findOneByEmail(email)
    if (isExistingEmail) throw new UnauthorizedException('Email đã được sử dụng')

    const username = generateSlug(fields.username)
    const isExistingUsername = await userService.findOneByUsername(username)
    if (isExistingUsername)
      throw new UnprocessableEntityException([
        {
          message: 'Username đã được sử dụng',
          path: ['username'],
        },
      ])

    const hashedPassword = await hashingService.hash(passwordRaw)

    // Clean fields (remove password field if it exists in the spread object to avoid confusion,
    // though we pass hashedPassword explicitly)

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

    return { accessToken, refreshToken, userId: result.id.toString() }
  }

  async login(email: string, passwordRaw: string) {
    const result = await userService.findOneByEmail(email)
    if (!result) throw new UnauthorizedException('Email hoặc mật khẩu không đúng')

    const isPasswordValid = await hashingService.compare(passwordRaw, result.hashedPassword)
    if (!isPasswordValid) throw new UnauthorizedException('Email hoặc mật khẩu không đúng')

    const { accessToken, refreshToken } = jwtService.generateTokens({
      email,
      userId: result.id.toString(),
    })

    await this.addRefreshTokenToRedis(refreshToken, result.id.toString())

    return { accessToken, refreshToken, userId: result.id.toString() }
  }

  async refreshToken(token: string) {
    // 1. Verify jwt
    const { jti, exp, userId, email } = jwtService.verifyRefreshToken(token)
    // 2. Kiểm tra token có trong redis không
    const storedUserId = await redisService.get(`${jti}`)
    if (!storedUserId)
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã bị thu hồi')

    await redisService.del(`${jti}`)
    // 3. Tạo token mới
    const newAccessToken = jwtService.signAccessToken({ userId, email })
    const newRefreshToken = jwtService.signRefreshToken({ userId, email }, exp)
    // 4. Lưu refresh token mới vào redis
    await this.addRefreshTokenToRedis(newRefreshToken, userId)

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    }
  }

  async logout(refreshToken: string) {
    const { jti } = jwtService.verifyRefreshToken(refreshToken)
    await redisService.del(`${jti}`)
  }

  async logoutAllDevices(refreshToken: string) {
    const { userId } = jwtService.verifyRefreshToken(refreshToken)
    await this.revokeAllRefreshTokens(userId)
  }

  async sendForgotPasswordOtp(email: string) {
    const existingEmail = await userService.findOneByEmail(email)
    if (!existingEmail) throw new NotFoundException('Email không tồn tại trong hệ thống')
    await this.generateOtpAndSendEmail(email, OtpType.ResetPasswordReqBodyDto)
  }

  async verifyForgotPasswordOtp(email: string, otp: string) {
    const token = await this.verifyEmailOtp(email, otp, OtpType.ResetPasswordReqBodyDto)
    return token
  }

  async resetPassword(token: string, passwordRaw: string) {
    const { email, type, exp } = jwtService.verifyOtpToken(token)
    if (type !== OtpType.ResetPasswordReqBodyDto) throw new UnauthorizedException()
    if (Date.now() >= exp * 1000)
      throw new UnauthorizedException('Forgot password token đã hết hạn')

    const user = await userService.findOneByEmail(email)
    if (!user) throw new NotFoundException('Người dùng không tồn tại')

    const hashedPassword = await hashingService.hash(passwordRaw)
    const result = await userService.update(user.id.toString(), { hashedPassword })
    if (!result) throw new NotFoundException('Người dùng không tồn tại')

    const { accessToken, refreshToken } = jwtService.generateTokens({
      email,
      userId: user.id.toString(),
    })
    await this.addRefreshTokenToRedis(refreshToken, user.id.toString())

    return { accessToken, refreshToken }
  }
}

export const authService = new AuthService()
