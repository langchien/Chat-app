import { accessTokenValidate } from '@/core/access-token.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { UserIdReqParamsDto } from '../user/user.req.dto'
import { chatCtrl } from './chat.ctrl'
import {
  AddParticipantsReqBodyDto,
  ChatIdParam,
  CreateChatReq,
  RemoveParticipantReqParam,
  UpdateChatDisplayNameReqBodyDto,
  UpdateChatReq,
} from './chat.req.dto'

export const chatRouter = Router()

chatRouter.use(accessTokenValidate)

chatRouter.post('/', zodValidate(CreateChatReq), chatCtrl.create)

chatRouter.patch(
  '/:chatId',
  zodValidate(ChatIdParam, 'params'),
  zodValidate(UpdateChatReq),
  chatCtrl.update,
)

chatRouter.patch(
  '/:chatId/display-name',
  zodValidate(ChatIdParam, 'params'),
  zodValidate(UpdateChatDisplayNameReqBodyDto),
  chatCtrl.updateChatDisplayName,
)

chatRouter.get('/:chatId', zodValidate(ChatIdParam, 'params'), chatCtrl.getById)

chatRouter.delete('/:chatId', zodValidate(ChatIdParam, 'params'), chatCtrl.delete)

chatRouter.get('/', chatCtrl.paginate)

chatRouter.get(
  '/user/:userId',
  zodValidate(UserIdReqParamsDto, 'params'),
  chatCtrl.getOrCreateChatByUserId,
)

chatRouter.get('/:chatId/links', zodValidate(ChatIdParam, 'params'), chatCtrl.getLinks)

chatRouter.get('/:chatId/media', zodValidate(ChatIdParam, 'params'), chatCtrl.getMedia)

chatRouter.post(
  '/:chatId/participants',
  zodValidate(ChatIdParam, 'params'),
  zodValidate(AddParticipantsReqBodyDto),
  chatCtrl.addParticipants,
)

chatRouter.delete(
  '/:chatId/participants/:userId',
  zodValidate(RemoveParticipantReqParam, 'params'),
  chatCtrl.removeParticipant,
)
