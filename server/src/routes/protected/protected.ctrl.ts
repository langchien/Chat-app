import { HttpStatusCode } from '@/core/status-code'
import { RequestHandler } from 'express'
import { UserResDto } from '../user/user.res.dto'
import { IChangePassworBodyDto, IUpdateProfileBodyDto } from './protected.dto'
import { protectedService } from './protected.service'

export class ProtectedCtrl {
  getProfile: RequestHandler = async (req, res) => {
    const userId = req.user.userId
    const user = await protectedService.getProfile(userId)
    res.status(HttpStatusCode.Ok).json(UserResDto.parse(user))
  }

  updateProfile: RequestHandler<any, any, IUpdateProfileBodyDto> = async (req, res) => {
    const userId = req.user.userId
    const result = await protectedService.updateProfile(userId, req.body)
    res.status(HttpStatusCode.Ok).json(UserResDto.parse(result))
  }

  changePassword: RequestHandler<any, any, IChangePassworBodyDto> = async (req, res) => {
    const userId = req.user.userId
    const result = await protectedService.changePassword(userId, req.body)
    res.status(HttpStatusCode.Ok).json(UserResDto.parse(result))
  }
}

export const protectedCtrl = new ProtectedCtrl()
