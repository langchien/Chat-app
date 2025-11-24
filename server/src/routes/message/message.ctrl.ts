import { NotFoundException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { PaginateCursorCtrl } from '@/lib/paginate-cusor.ctrl'
import { RequestHandler } from 'express'
import { IChatIdParamDto } from '../chat/chat.req.dto'
import { messageRepo } from './message.repo'
import { ICreateMessageBodyDto, IMessageIdParamDto, IUpdateMessageBodyDto } from './message.req.dto'
import { IGetMessageResDto, IMessagePaginateCursorResDto } from './message.res.dto'

class MessageCtrl extends PaginateCursorCtrl {
  findOneById: RequestHandler<IMessageIdParamDto, IGetMessageResDto> = async (req, res) => {
    const { messageId } = req.params
    const message = await messageRepo.findOneById(messageId)
    if (!message) throw new NotFoundException('Không tìm thấy tin nhắn')
    res.json(message)
  }

  deleteOneById: RequestHandler<IMessageIdParamDto> = async (req, res) => {
    const { messageId } = req.params
    const result = await messageRepo.delete(messageId)
    if (!result) throw new NotFoundException('Không tìm thấy tin nhắn')
    res.status(204).end()
  }

  getMessagesByCursor: RequestHandler<IChatIdParamDto, IMessagePaginateCursorResDto> = async (
    req,
    res,
  ) => {
    const { chatId } = req.params
    const { limit, cursor } = this.parsePaginationQuery(req.query)
    const result = await messageRepo.getMessagesByCursor(chatId, { limit, cursor })
    res.json(result)
  }

  create: RequestHandler<any, IGetMessageResDto, ICreateMessageBodyDto> = async (req, res) => {
    const result = await messageRepo.create({
      ...req.body,
      senderId: req.user.userId,
    })
    res.status(HttpStatusCode.Created).json(result)
  }

  update: RequestHandler<IMessageIdParamDto, IGetMessageResDto, IUpdateMessageBodyDto> = async (
    req,
    res,
  ) => {
    const { messageId } = req.params
    const result = await messageRepo.update(messageId, req.body)
    if (!result) throw new NotFoundException('Không tìm thấy tin nhắn')
    res.json(result)
  }
}

export const messageCtrl = new MessageCtrl()
