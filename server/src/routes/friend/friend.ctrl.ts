import { BadRequestException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { BaseController } from '@/lib/database'
import { IIdParamDto } from '@/lib/schema.common'
import { RequestHandler } from 'express'
import { IUserResDto, UserResDto } from '../user/user.res.dto'
import { userService } from '../user/user.service'
import { ICreateFriendRequestBodyDto, SearchFriendReqQueryDto } from './friend.req.dto'
import { IFriendRequestResDto } from './friend.res.dto'
import { friendService } from './friend.service'

class FriendController extends BaseController {
  searchNewFriends: RequestHandler<any, IUserResDto[]> = async (req, res) => {
    const parseQuery = SearchFriendReqQueryDto.safeParse(req.query)
    if (parseQuery.error)
      throw new BadRequestException({
        location: 'query',
        errors: parseQuery.error.issues,
      })
    const { q, limit } = parseQuery.data
    const fromId = req.user!.userId
    const result = await userService.searchExcludeFriend(q, fromId, limit)
    res.json(UserResDto.array().parse(result))
  }

  createFriendRequest: RequestHandler<any, IFriendRequestResDto, ICreateFriendRequestBodyDto> =
    async (req, res) => {
      const fromId = req.user.userId
      if (fromId === req.body.toId)
        throw new BadRequestException(undefined, 'Không thể gửi lời mời kết bạn với chính mình')
      const result = await friendService.createFriendRequest({
        ...req.body,
        fromId,
      })
      res.json(result)
    }

  acceptFriendRequest: RequestHandler<IIdParamDto> = async (req, res) => {
    const { id } = req.params
    const result = await friendService.acceptFriendRequest(id, req.user.userId)
    res.json(result)
  }

  rejectFriendRequest: RequestHandler<IIdParamDto, IFriendRequestResDto> = async (req, res) => {
    const { id } = req.params
    const result = await friendService.rejectFriendRequest(id)
    res.json(result)
  }

  deleteFriendRequest: RequestHandler<IIdParamDto, void> = async (req, res) => {
    const { id } = req.params
    const userId = req.user.userId
    await friendService.delete(id)
    res.status(HttpStatusCode.NoContent).json()
  }
}

export const friendCtrl = new FriendController()
