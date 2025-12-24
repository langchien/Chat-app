import { BadRequestException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { BaseController } from '@/lib/database'
import { IIdParamDto } from '@/lib/schema.common'
import { FriendRequestStatus } from '@prisma/client'
import { RequestHandler } from 'express'
import { IUserIdReqParamsDto } from '../user/user.req.dto'
import { IUserResDto, UserResDto } from '../user/user.res.dto'
import { userService } from '../user/user.service'
import {
  ICreateFriendRequestBodyDto,
  IUpdateFriendRequestBodyDto,
  SearchFriendReqQueryDto,
} from './friend.req.dto'
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
      const result = await friendService.createFriendRequest({
        ...req.body,
        fromId,
      })
      res.json(result)
    }

  updateFriendRequestStatus: RequestHandler<
    IIdParamDto,
    IFriendRequestResDto,
    IUpdateFriendRequestBodyDto
  > = async (req, res) => {
    const { id } = req.params
    const status = req.body.status
    if (status === FriendRequestStatus.pending) throw new BadRequestException()
    if (status === FriendRequestStatus.accepted) {
      const result = await friendService.acceptFriendRequest(id, req.user.userId)
      res.json(result.friendRequest)
    } else if (status === FriendRequestStatus.rejected) {
      const result = await friendService.rejectFriendRequest(id, req.user.userId)
      res.json(result)
    }
  }

  getListFriendRequest: RequestHandler<any, IFriendRequestResDto[]> = async (req, res) => {
    const result = await friendService.getListFriendRequest(req.user.userId)
    res.json(result)
  }

  getListFriendRequestFrom: RequestHandler<any, IFriendRequestResDto[]> = async (req, res) => {
    const result = await friendService.getListFriendRequestFrom(req.user.userId)
    res.json(result)
  }

  deleteFriendRequest: RequestHandler<IIdParamDto> = async (req, res) => {
    const { id } = req.params
    const result = await friendService.deleteFriendRequest(id, req.user.userId)
    res.json(result)
  }

  getAllFriend: RequestHandler<any, IUserResDto[]> = async (req, res) => {
    const result = await friendService.getAllFriend(req.user.userId)
    res.json(UserResDto.array().parse(result))
  }

  unfriend: RequestHandler<IUserIdReqParamsDto> = async (req, res) => {
    const { userId } = req.params
    await friendService.unfriend(req.user.userId, userId)
    res.status(HttpStatusCode.NoContent).json(null)
  }
}

export const friendCtrl = new FriendController()
