import { zodValidate } from '@/core/validate.middleware'
import { Router } from 'express'
import { ChatIdParamSchema } from '../chat/chat.req.dto'
import { messageCtrl } from './message.ctrl'
import { MessageIdParamSchema } from './message.req.dto'

export const messageRouter = Router()

messageRouter.get(
  '/:messageId',
  zodValidate(MessageIdParamSchema, 'params'),
  messageCtrl.findOneById,
)

messageRouter.delete(
  '/:messageId',
  zodValidate(MessageIdParamSchema, 'params'),
  messageCtrl.deleteOneById,
)

messageRouter.get(
  '/chat/:chatId',
  zodValidate(ChatIdParamSchema, 'params'),
  messageCtrl.getMessagesByCursor,
)
