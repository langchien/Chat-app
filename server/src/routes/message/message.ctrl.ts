import { NotFoundException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { PaginateCursorCtrl } from '@/lib/paginate-cusor.ctrl'
import { RequestHandler } from 'express'
import { IChatIdParamDto } from '../chat/chat.req.dto'
import { messageRepo } from './message.repo'
import { ICreateMessageBodyDto, IMessageIdParamDto, IUpdateMessageBodyDto } from './message.req.dto'
import {
  IMessagePaginateCursorResDto,
  IMessageResDto,
  MessagePaginateCursorResDto,
  MessageResDto,
} from './message.res.dto'

class MessageCtrl extends PaginateCursorCtrl {
  findOneById: RequestHandler<IMessageIdParamDto, IMessageResDto> = async (req, res) => {
    const { messageId } = req.params
    const message = await messageRepo.findOneById(messageId)
    if (!message) throw new NotFoundException('Không tìm thấy tin nhắn')
    res.json(MessageResDto.parse(message))
  }

  deleteOneById: RequestHandler<IMessageIdParamDto> = async (req, res) => {
    try {
      const { messageId } = req.params
      await messageRepo.delete(messageId)
      res.status(204).json()
    } catch (e) {
      this.handleNotFoundError(e, 'Không tìm thấy tin nhắn')
    }
  }

  getMessagesByCursor: RequestHandler<IChatIdParamDto, IMessagePaginateCursorResDto> = async (
    req,
    res,
  ) => {
    const { chatId } = req.params
    const { limit, cursor } = this.parsePaginationQuery(req.query)
    const result = await messageRepo.getMessagesByCursor(chatId, { limit, cursor })
    res.json(MessagePaginateCursorResDto.parse(result))
  }

  create: RequestHandler<any, IMessageResDto, ICreateMessageBodyDto> = async (req, res) => {
    const result = await messageRepo.create({
      ...req.body,
      senderId: req.user.userId,
    })
    res.status(HttpStatusCode.Created).json(MessageResDto.parse(result))
  }

  update: RequestHandler<IMessageIdParamDto, IMessageResDto, IUpdateMessageBodyDto> = async (
    req,
    res,
  ) => {
    try {
      const { messageId } = req.params
      const result = await messageRepo.update(messageId, req.body)
      res.json(MessageResDto.parse(result))
    } catch (e) {
      this.handleNotFoundError(e, 'Không tìm thấy tin nhắn')
    }
  }
}

export const messageCtrl = new MessageCtrl()
