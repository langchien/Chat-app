import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { userController } from './user.ctrl'
import {
  CreateUserReqBodySchema,
  UpdateUserReqBodySchema,
  UserIdReqParamsDtoSchema,
  UserSearchReqQueryDtoSchema,
} from './user.req.dto'

export const userRouter = Router()

userRouter.get('/:userId', zodValidate(UserIdReqParamsDtoSchema, 'params'), userController.findOne)

userRouter.get('/', zodValidate(UserSearchReqQueryDtoSchema, 'query'), userController.search)

userRouter.delete(
  '/:userId',
  zodValidate(UserIdReqParamsDtoSchema, 'params'),
  userController.delete,
)

userRouter.post('/', zodValidate(CreateUserReqBodySchema), userController.create)

userRouter.patch(
  '/:userId',
  zodValidate(UserIdReqParamsDtoSchema, 'params'),
  zodValidate(UpdateUserReqBodySchema),
  userController.update,
)
