import { NotFoundException } from '@/core/exceptions'
import { PaginateCursorCtrl } from '@/lib/paginate-cusor.ctrl'
import { RequestHandler } from 'express'
import { IChatIdParam } from '../chat/chat.req.dto'
import { messageRepo } from './message.repo'
import { IMessageIdParam } from './message.req.dto'
import { IMessagePaginateCursorRes, IMessageRes } from './message.res.dto'

class MessageCtrl extends PaginateCursorCtrl {
  findOneById: RequestHandler<IMessageIdParam, IMessageRes> = async (req, res) => {
    const { messageId } = req.params
    const message = await messageRepo.findOneById(messageId)
    if (!message) throw new NotFoundException('Không tìm thấy tin nhắn')
    res.json(message)
  }

  deleteOneById: RequestHandler<IMessageIdParam> = async (req, res) => {
    const { messageId } = req.params
    const result = await messageRepo.delete(messageId)
    if (!result) throw new NotFoundException('Không tìm thấy tin nhắn')
    res.status(204).end()
  }

  getMessagesByCursor: RequestHandler<IChatIdParam, IMessagePaginateCursorRes> = async (
    req,
    res,
  ) => {
    const { chatId } = req.params
    const { limit, cursor } = this.parsePaginationQuery(req.query)
    const result = await messageRepo.getMessagesByCursor(chatId, { limit, cursor })
    res.json(result)
  }
}

export const messageCtrl = new MessageCtrl()
