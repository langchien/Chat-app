import { ConflictException, UnauthorizedException } from '@/core/exceptions'
import { hashingService } from '@/lib/hashing.service'
import { userService } from '../user/user.service'
import { IChangePassworBodyDto, IUpdateProfileBodyDto } from './protected.dto'

class ProtectedService {
  async getProfile(userId: string) {
    const user = await userService.findOneById(userId)
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại!')
    return user
  }

  async updateProfile(userId: string, data: IUpdateProfileBodyDto) {
    const result = await userService.update(userId, data)
    if (!result) throw new UnauthorizedException('Tài khoản không tồn tại!')
    return result
  }

  async changePassword(userId: string, body: IChangePassworBodyDto) {
    const { oldPassword, newPassword } = body
    const user = await userService.findOneById(userId)
    if (!user) throw new UnauthorizedException('Tài khoản không tồn tại!')

    const isPasswordMatch = await hashingService.compare(oldPassword, user.hashedPassword)
    if (!isPasswordMatch) throw new ConflictException('Mật khẩu cũ không đúng')

    if (oldPassword === newPassword)
      throw new ConflictException('Mật khẩu mới không được trùng với mật khẩu cũ')

    const hashPassword = await hashingService.hash(newPassword)
    const result = await userService.update(userId, { hashedPassword: hashPassword })
    if (!result) throw new UnauthorizedException('Tài khoản không tồn tại!')
    return result
  }
}

export const protectedService = new ProtectedService()
