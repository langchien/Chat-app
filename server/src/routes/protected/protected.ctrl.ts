import { ConflictException, UnauthorizedException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { hashingService } from '@/lib/hashing.service'
import { RequestHandler } from 'express'
import { UserResDto } from '../user/user.res.dto'
import { userService } from '../user/user.service'
import { IChangePassworBodyDto, IUpdateProfileBodyDto } from './protected.dto'

export class ProtectedCtrl {
  getProfile: RequestHandler = async (req, res) => {
    const userId = req.user.userId
    const user = await userService.findOneById(userId)
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại!')
    res.status(HttpStatusCode.Ok).json(UserResDto.parse(user))
  }

  updateProfile: RequestHandler<any, any, IUpdateProfileBodyDto> = async (req, res) => {
    const userId = req.user.userId
    const result = await userService.update(userId, req.body)
    if (!result) throw new UnauthorizedException('Tài khoản không tồn tại!')
    res.status(HttpStatusCode.Ok).json(UserResDto.parse(result))
  }

  changePassword: RequestHandler<any, any, IChangePassworBodyDto> = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const userId = req.user.userId
    const user = await userService.findOneById(userId)
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại!')
    const isPasswordMatch = await hashingService.compare(oldPassword, user.hashedPassword)
    if (!isPasswordMatch) throw new ConflictException('Mật khẩu cũ không đúng')
    if (oldPassword === newPassword)
      throw new ConflictException('Mật khẩu mới không được trùng với mật khẩu cũ')
    const hashPassword = await hashingService.hash(newPassword)
    const result = await userService.update(userId, { hashedPassword: hashPassword })
    if (!result) throw new UnauthorizedException('Tài khoản không tồn tại!')
    res.status(HttpStatusCode.Ok).json(UserResDto.parse(result))
  }
}

export const protectedCtrl = new ProtectedCtrl()
