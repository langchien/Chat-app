import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { userController } from './user.ctrl'
import {
  CreateUserReqBodyDto,
  UpdateUserReqBodyDto,
  UserIdReqParamsDto,
  UserSearchReqQueryDto,
} from './user.req.dto'

export const userRouter = Router()

userRouter.get('/:userId', zodValidate(UserIdReqParamsDto, 'params'), userController.findOne)

userRouter.get('/', zodValidate(UserSearchReqQueryDto, 'query'), userController.search)

userRouter.delete('/:userId', zodValidate(UserIdReqParamsDto, 'params'), userController.delete)

userRouter.post('/', zodValidate(CreateUserReqBodyDto), userController.create)

userRouter.patch(
  '/:userId',
  zodValidate(UserIdReqParamsDto, 'params'),
  zodValidate(UpdateUserReqBodyDto),
  userController.update,
)
