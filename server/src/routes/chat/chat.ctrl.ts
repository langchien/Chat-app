import { NotFoundException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { isRecordNotFoundError } from '@/lib/database'
import { PaginateCursorCtrl } from '@/lib/paginate-cusor.ctrl'
import { SOCKET_EVENTS } from '@/socket/event.const'
import { RequestHandler } from 'express'
import { IUserIdReqParamsDto } from '../user/user.req.dto'
import {
  IChatIdParamDto,
  ICreateChatReqDto,
  IUpdateChatDisplayNameReqBodyDto,
  IUpdateChatReqDto,
} from './chat.req.dto'
import { ChatResDto, IChatResDto } from './chat.res.dto'
import { chatService } from './chat.service'

export class ChatCtrl extends PaginateCursorCtrl {
  create: RequestHandler<any, IChatResDto, ICreateChatReqDto> = async (req, res) => {
    const userId = req.user.userId
    const { receiverIds, ...restData } = req.body
    const result = await chatService.create({
      ...restData,
      receiverIds: [...new Set([...receiverIds, userId])],
    })
    const parseData = ChatResDto.parse(result)
    req.io.to(userId).emit(SOCKET_EVENTS.UPDATE_CHAT, parseData)
    receiverIds.forEach((receiverId) => {
      req.io.to(receiverId).emit(SOCKET_EVENTS.UPDATE_CHAT, parseData)
    })
    res.status(HttpStatusCode.Created).json(parseData)
  }

  update: RequestHandler<IChatIdParamDto, IChatResDto, IUpdateChatReqDto> = async (req, res) => {
    try {
      const { chatId } = req.params
      const result = await chatService.update(chatId, req.body)
      res.status(HttpStatusCode.Ok).json(ChatResDto.parse(result))
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException('Chat không tồn tại')
    }
  }
  updateChatDisplayName: RequestHandler<
    IChatIdParamDto,
    IChatResDto,
    IUpdateChatDisplayNameReqBodyDto
  > = async (req, res) => {
    const io = req.io
    const { chatId } = req.params
    const { userId } = req.user
    const { displayName } = req.body

    const result = await chatService.updateChatDisplayName(chatId, userId, displayName)

    const restulParsed = ChatResDto.parse(result)
    io.to(chatId).emit(SOCKET_EVENTS.UPDATE_CHAT, restulParsed)
    res.json(restulParsed)
  }

  getById: RequestHandler<IChatIdParamDto> = async (req, res) => {
    const { chatId } = req.params
    const userId = req.user.userId
    const result = await chatService.findOneById(chatId, userId)
    if (!result) throw new NotFoundException('Chat không tồn tại')
    res.status(HttpStatusCode.Ok).json(ChatResDto.parse(result))
  }

  delete: RequestHandler<IChatIdParamDto> = async (req, res) => {
    try {
      const { chatId } = req.params
      await chatService.delete(chatId)
      req.io.to(chatId).emit(SOCKET_EVENTS.DELETE_CHAT, { chatId })
      res.status(HttpStatusCode.NoContent).json()
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException('Chat không tồn tại')
      throw error
    }
  }

  paginate: RequestHandler = async (req, res) => {
    const query = this.parsePaginationQuery(req.query)
    const results = await chatService.getChatsByCursor(req.user.userId, query)
    res.json(results)
  }

  getOrCreateChatByUserId: RequestHandler<IUserIdReqParamsDto, IChatResDto> = async (req, res) => {
    const { userId } = req.params
    const result = await chatService.getOrCreateChatByUserId(userId, req.user.userId)
    const restulParsed = ChatResDto.parse(result.chat)
    if (result.isCreate) {
      req.io.to(userId).emit(SOCKET_EVENTS.UPDATE_CHAT, restulParsed)
      req.io.to(req.user.userId).emit(SOCKET_EVENTS.UPDATE_CHAT, restulParsed)
    }
    res.json(restulParsed)
  }
}

export const chatCtrl = new ChatCtrl()
