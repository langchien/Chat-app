import { accessTokenValidate } from '@/core/access-token.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { ChatIdParam } from '../chat/chat.req.dto'
import { messageCtrl } from './message.ctrl'
import { CreateMessageBodyDto, MessageIdParamDto } from './message.req.dto'

export const messageRouter = Router()

messageRouter.use(accessTokenValidate)
messageRouter.get('/:messageId', zodValidate(MessageIdParamDto, 'params'), messageCtrl.findOneById)

messageRouter.delete(
  '/:messageId',
  zodValidate(MessageIdParamDto, 'params'),
  messageCtrl.deleteOneById,
)

messageRouter.get(
  '/chat/:chatId',
  zodValidate(ChatIdParam, 'params'),
  messageCtrl.getMessagesByCursor,
)

messageRouter.post('/', zodValidate(CreateMessageBodyDto), messageCtrl.create)
messageRouter.patch(
  '/:messageId',
  zodValidate(MessageIdParamDto, 'params'),
  zodValidate(CreateMessageBodyDto),
  messageCtrl.update,
)
