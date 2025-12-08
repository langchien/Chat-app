import { Router } from 'express'

export const friendRoute = Router()

import { accessTokenValidate } from '@/core/access-token.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { IdParamDto } from '@/lib/schema.common'
import { friendCtrl } from './friend.ctrl'
import { CreateFriendRequestBodyDto, UpdateFriendRequestBodyDto } from './friend.req.dto'

friendRoute.get('/search', accessTokenValidate, friendCtrl.searchNewFriends)

friendRoute.post(
  '/',
  accessTokenValidate,
  zodValidate(CreateFriendRequestBodyDto, 'body'),
  friendCtrl.createFriendRequest,
)

friendRoute.patch(
  '/:id',
  accessTokenValidate,
  zodValidate(IdParamDto, 'params'),
  zodValidate(UpdateFriendRequestBodyDto, 'body'),
  // friendCtrl.updateFriendRequestStatus,
)
