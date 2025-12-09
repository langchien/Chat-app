import { BadRequestException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { BaseController } from '@/lib/database'
import { IIdParamDto } from '@/lib/schema.common'
import { SOCKET_EVENTS } from '@/socket/event.const'
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
import {
  IFriendRequestResDto,
  IFriendStatusResDto,
  IReceivedFriendRequestResDto,
  ISentFriendRequestResDto,
  ReceivedFriendRequestResDto,
  SentFriendRequestResDto,
} from './friend.res.dto'

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

  getReceivedFriendRequests: RequestHandler<any, IReceivedFriendRequestResDto[]> = async (
    req,
    res,
  ) => {
    const result = await friendService.getReceivedFriendRequests(req.user.userId)
    res.json(ReceivedFriendRequestResDto.array().parse(result))
  }

  getSentFriendRequests: RequestHandler<any, ISentFriendRequestResDto[]> = async (req, res) => {
    const result = await friendService.getSentFriendRequests(req.user.userId)
    res.json(SentFriendRequestResDto.array().parse(result))
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
    req.io.to(userId).emit(SOCKET_EVENTS.UNFRIEND, req.user.userId)
    req.io.to(req.user.userId).emit(SOCKET_EVENTS.UNFRIEND, userId)
    res.status(HttpStatusCode.NoContent).json(null)
  }

  getFriendStatus: RequestHandler<IUserIdReqParamsDto, IFriendStatusResDto> = async (req, res) => {
    const { userId } = req.params
    const status = await friendService.getFriendStatus(req.user.userId, userId)
    res.json({ status })
  }
}

export const friendCtrl = new FriendController()
