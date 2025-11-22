import { accessTokenValidate } from '@/core/access-token.middleware'
import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { ChatIdParamSchema } from '../chat/chat.req.dto'
import { messageCtrl } from './message.ctrl'
import { CreateMessageBodySchema, MessageIdParamSchema } from './message.req.dto'

export const messageRouter = Router()

messageRouter.get(
  '/:messageId',
  accessTokenValidate,
  zodValidate(MessageIdParamSchema, 'params'),
  messageCtrl.findOneById,
)

messageRouter.delete(
  '/:messageId',
  accessTokenValidate,
  zodValidate(MessageIdParamSchema, 'params'),
  messageCtrl.deleteOneById,
)

messageRouter.get(
  '/chat/:chatId',
  accessTokenValidate,
  zodValidate(ChatIdParamSchema, 'params'),
  messageCtrl.getMessagesByCursor,
)

messageRouter.post(
  '/',
  accessTokenValidate,
  zodValidate(CreateMessageBodySchema),
  messageCtrl.create,
)
messageRouter.patch(
  '/:messageId',
  accessTokenValidate,
  zodValidate(MessageIdParamSchema, 'params'),
  zodValidate(CreateMessageBodySchema),
  messageCtrl.update,
)
