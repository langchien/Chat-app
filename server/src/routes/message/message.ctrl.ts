import { NotFoundException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { PaginateCursorCtrl } from '@/lib/paginate-cusor.ctrl'
import { socketService } from '@/socket'
import { RequestHandler } from 'express'
import { IChatIdParamDto } from '../chat/chat.req.dto'
import { ChatResDto, IChatResDto } from '../chat/chat.res.dto'
import { ICreateMessageBodyDto, IMessageIdParamDto, IUpdateMessageBodyDto } from './message.req.dto'
import {
  IMessagePaginateCursorResDto,
  IMessageResDto,
  MessagePaginateCursorResDto,
  MessageResDto,
} from './message.res.dto'
import { messageService } from './message.service'

class MessageCtrl extends PaginateCursorCtrl {
  findOneById: RequestHandler<IMessageIdParamDto, IMessageResDto> = async (req, res) => {
    const { messageId } = req.params
    const message = await messageService.findOneById(messageId)
    if (!message) throw new NotFoundException('Không tìm thấy tin nhắn')
    res.json(MessageResDto.parse(message))
  }

  deleteOneById: RequestHandler<IMessageIdParamDto> = async (req, res) => {
    const { messageId } = req.params
    await messageService.delete(messageId)
    res.status(204).json()
  }

  getMessagesByCursor: RequestHandler<IChatIdParamDto, IMessagePaginateCursorResDto> = async (
    req,
    res,
  ) => {
    const { chatId } = req.params
    const { limit, cursor } = this.parsePaginationQuery(req.query)
    const result = await messageService.getMessagesByCursor(chatId, req.user.userId, {
      limit,
      cursor,
    })
    res.json(MessagePaginateCursorResDto.parse(result))
  }

  create: RequestHandler<
    any,
    {
      message: IMessageResDto
      chat: IChatResDto
    },
    ICreateMessageBodyDto
  > = async (req, res) => {
    const { message, chat } = await messageService.create({
      ...req.body,
      senderId: req.user.userId,
    })
    const messageRes = MessageResDto.parse(message)
    const chatRes = ChatResDto.parse(chat)
    const resultPayload = { message: messageRes, chat: chatRes }
    socketService.sendMessage(chat.id, resultPayload)
    res.status(HttpStatusCode.Created).json(resultPayload)
  }

  update: RequestHandler<IMessageIdParamDto, IMessageResDto, IUpdateMessageBodyDto> = async (
    req,
    res,
  ) => {
    const { messageId } = req.params
    const result = await messageService.update(messageId, req.body)
    res.json(MessageResDto.parse(result))
  }
}

export const messageCtrl = new MessageCtrl()
