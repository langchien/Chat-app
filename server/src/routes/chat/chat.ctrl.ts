import { NotFoundException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { PaginateCursorCtrl } from '@/lib/paginate-cusor.ctrl'
import { RequestHandler } from 'express'
import { chatRepo } from './chat.repo'
import { IChatIdParamDto, ICreateChatReqDto, IUpdateChatReqDto } from './chat.req.dto'
import { ChatResDto, IChatResDto } from './chat.res.dto'

export class ChatCtrl extends PaginateCursorCtrl {
  create: RequestHandler<any, IChatResDto, ICreateChatReqDto> = async (req, res) => {
    const userId = req.user.userId
    const { receiverIds, lastMessage } = req.body
    const result = await chatRepo.create({
      lastMessage,
      participants: [{ userId }, ...receiverIds.map((id) => ({ userId: id }))],
    })
    res.status(HttpStatusCode.Created).json(ChatResDto.parse(result))
  }

  update: RequestHandler<IChatIdParamDto, IChatResDto, IUpdateChatReqDto> = async (req, res) => {
    const { chatId } = req.params
    const result = await chatRepo.update(chatId, req.body)
    if (!result) throw new NotFoundException('Chat không tồn tại')
    res.status(HttpStatusCode.Ok).json(ChatResDto.parse(result))
  }

  getById: RequestHandler<IChatIdParamDto> = async (req, res) => {
    const { chatId } = req.params
    const userId = req.user.userId
    const result = await chatRepo.findOneById(chatId, userId)
    if (!result) throw new NotFoundException('Chat không tồn tại')
    res.status(HttpStatusCode.Ok).json(ChatResDto.parse(result))
  }

  delete: RequestHandler<IChatIdParamDto> = async (req, res) => {
    const { chatId } = req.params
    const result = await chatRepo.delete(chatId)
    if (!result) throw new NotFoundException('Chat không tồn tại')
    res.status(HttpStatusCode.NoContent).json({})
  }

  paginate: RequestHandler = async (req, res) => {
    const query = this.parsePaginationQuery(req.query)
    const results = await chatRepo.getChatsByCursor(req.user.userId, query)
    res.json(results)
  }
}

export const chatCtrl = new ChatCtrl()
