import { Router } from 'express'

export const friendRoute = Router()

import { accessTokenValidate } from '@/core/access-token.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { IdParamDto } from '@/lib/schema.common'
import { UserIdReqParamsDto } from '../user/user.req.dto'
import { friendCtrl } from './friend.ctrl'
import { CreateFriendRequestBodyDto, UpdateFriendRequestBodyDto } from './friend.req.dto'

friendRoute.use(accessTokenValidate)

friendRoute.get('/search', friendCtrl.searchNewFriends)

friendRoute.post(
  '/request',
  zodValidate(CreateFriendRequestBodyDto, 'body'),
  friendCtrl.createFriendRequest,
)

friendRoute.patch(
  '/:id',
  zodValidate(IdParamDto, 'params'),
  zodValidate(UpdateFriendRequestBodyDto, 'body'),
  friendCtrl.updateFriendRequestStatus,
)
friendRoute.get('/requests/received', friendCtrl.getReceivedFriendRequests)

friendRoute.get('/requests/sent', friendCtrl.getSentFriendRequests)

friendRoute.post(
  '/accept-by-user/:userId',
  zodValidate(UserIdReqParamsDto, 'params'),
  friendCtrl.acceptByUserId,
)

friendRoute.post(
  '/reject-by-user/:userId',
  zodValidate(UserIdReqParamsDto, 'params'),
  friendCtrl.rejectByUserId,
)

friendRoute.get(
  '/status/:userId',
  zodValidate(UserIdReqParamsDto, 'params'),
  friendCtrl.getFriendStatus,
)

friendRoute.delete(
  '/request/:requestId',
  zodValidate(IdParamDto, 'params'),
  friendCtrl.deleteFriendRequest,
)

friendRoute.get('/', friendCtrl.getAllFriend)

friendRoute.delete('/user/:userId', zodValidate(UserIdReqParamsDto, 'params'), friendCtrl.unfriend)
