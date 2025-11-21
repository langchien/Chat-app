import { ConflictException, UnauthorizedException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { hashingService } from '@/lib/hashing.service'
import { RequestHandler } from 'express'
import { userRepo } from '../user/user.repo'
import { ChangePassworDto, UpdateProfileDto } from './protected.dto'

export class ProtectedCtrl {
  getProfile: RequestHandler = async (req, res) => {
    const userId = req.user.userId
    const user = await userRepo.findOneById(userId)
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại!')
    res.status(HttpStatusCode.Ok).json({ data: user })
  }

  updateProfile: RequestHandler<any, any, UpdateProfileDto> = async (req, res) => {
    const userId = req.user.userId
    const result = await userRepo.update(userId, req.body)
    if (!result) throw new UnauthorizedException('Tài khoản không tồn tại!')
    res.status(HttpStatusCode.Ok).json(result)
  }

  changePassword: RequestHandler<any, any, ChangePassworDto> = async (req, res) => {
    const { oldPassword, newPassword } = req.body
    const userId = req.user.userId
    const user = await userRepo.findOneById(userId)
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại!')
    const isPasswordMatch = await hashingService.compare(oldPassword, user.hashedPassword)
    if (!isPasswordMatch) throw new ConflictException('Mật khẩu cũ không đúng')
    if (oldPassword === newPassword)
      throw new ConflictException('Mật khẩu mới không được trùng với mật khẩu cũ')
    const hashPassword = await hashingService.hash(newPassword)
    const result = await userRepo.update(userId, { hashedPassword: hashPassword })
    if (!result) throw new UnauthorizedException('Tài khoản không tồn tại!')
    res.status(HttpStatusCode.Ok).json(result)
  }
}

export const protectedCtrl = new ProtectedCtrl()
