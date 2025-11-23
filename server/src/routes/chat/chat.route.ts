import { accessTokenValidate } from '@/core/access-token.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { chatCtrl } from './chat.ctrl'
import { ChatIdParam, CreateChatReq, UpdateChatReq } from './chat.req.dto'

export const chatRouter = Router()

chatRouter.use(accessTokenValidate)

chatRouter.post('/', zodValidate(CreateChatReq), chatCtrl.create)

chatRouter.patch(
  '/:chatId',
  zodValidate(ChatIdParam, 'params'),
  zodValidate(UpdateChatReq),
  chatCtrl.update,
)
chatRouter.get('/:chatId', zodValidate(ChatIdParam, 'params'), chatCtrl.getById)

chatRouter.delete('/:chatId', zodValidate(ChatIdParam, 'params'), chatCtrl.delete)

chatRouter.get('/', chatCtrl.paginate)
