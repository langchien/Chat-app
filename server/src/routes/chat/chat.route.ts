import { accessTokenValidate } from '@/core/access-token.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { chatCtrl } from './chat.ctrl'
import { ChatIdParamSchema, CreateChatReqSchema, UpdateChatReqSchema } from './chat.req.dto'

export const chatRouter = Router()

chatRouter.use(accessTokenValidate)

chatRouter.post('/', zodValidate(CreateChatReqSchema), chatCtrl.create)

chatRouter.patch(
  '/:chatId',
  zodValidate(ChatIdParamSchema, 'params'),
  zodValidate(UpdateChatReqSchema),
  chatCtrl.update,
)
chatRouter.get('/:chatId', zodValidate(ChatIdParamSchema, 'params'), chatCtrl.getById)

chatRouter.delete('/:chatId', zodValidate(ChatIdParamSchema, 'params'), chatCtrl.delete)

chatRouter.get('/', chatCtrl.paginate)
