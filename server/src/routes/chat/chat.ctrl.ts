import { NotFoundException } from '@/core/exceptions'
import { HttpStatusCode } from '@/core/status-code'
import { isRecordNotFoundError } from '@/lib/database'
import { PaginateCursorCtrl } from '@/lib/paginate-cusor.ctrl'
import { SOCKET_EVENTS } from '@/socket/event.const'
import { RequestHandler } from 'express'
import { IChat } from './chat.db'
import { chatRepo } from './chat.repo'
import {
  IChatIdParamDto,
  ICreateChatReqDto,
  IUpdateChatDisplayNameReqBodyDto,
  IUpdateChatReqDto,
} from './chat.req.dto'
import { ChatResDto, IChatResDto } from './chat.res.dto'

export class ChatCtrl extends PaginateCursorCtrl {
  create: RequestHandler<any, IChatResDto, ICreateChatReqDto> = async (req, res) => {
    const userId = req.user.userId
    const { receiverIds, ...restData } = req.body
    const result = await chatRepo.create({
      ...restData,
      receiverIds: [...new Set([...receiverIds, userId])],
    })
    res.status(HttpStatusCode.Created).json(ChatResDto.parse(result))
  }

  update: RequestHandler<IChatIdParamDto, IChatResDto, IUpdateChatReqDto> = async (req, res) => {
    try {
      const { chatId } = req.params
      const result = await chatRepo.update(chatId, req.body)
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
    const chat = await chatRepo.findOneById(chatId, userId)
    if (!chat) throw new NotFoundException('Chat không tồn tại')
    const { displayName } = req.body
    const groupInfo = chat.groupInfo
    let result: IChat
    if (groupInfo) {
      const updatedChat = await chatRepo.update(chatId, {
        groupInfo: {
          ...groupInfo,
          name: displayName,
        },
      })
      result = updatedChat
    } else {
      const members = chat.participants.filter((p) => p.userId !== userId)
      const member = members[0]
      const updatedParticipant = await chatRepo.updateParticipantsNickname(member.id, displayName)
      result = {
        ...chat,
        participants: chat.participants.map((p) =>
          p.id === updatedParticipant.id ? { ...p, nickname: updatedParticipant.nickname } : p,
        ),
      }
    }
    const restulParsed = ChatResDto.parse(result)
    io.to(chatId).emit(SOCKET_EVENTS.UPDATE_CHAT, restulParsed)
    res.status(HttpStatusCode.Ok).json(restulParsed)
  }

  getById: RequestHandler<IChatIdParamDto> = async (req, res) => {
    const { chatId } = req.params
    const userId = req.user.userId
    const result = await chatRepo.findOneById(chatId, userId)
    if (!result) throw new NotFoundException('Chat không tồn tại')
    res.status(HttpStatusCode.Ok).json(ChatResDto.parse(result))
  }

  delete: RequestHandler<IChatIdParamDto> = async (req, res) => {
    try {
      const { chatId } = req.params
      await chatRepo.delete(chatId)
      req.io.to(chatId).emit(SOCKET_EVENTS.DELETE_CHAT, { chatId })
      res.status(HttpStatusCode.NoContent).json()
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException('Chat không tồn tại')
      throw error
    }
  }

  paginate: RequestHandler = async (req, res) => {
    const query = this.parsePaginationQuery(req.query)
    const results = await chatRepo.getChatsByCursor(req.user.userId, query)
    res.json(results)
  }
}

export const chatCtrl = new ChatCtrl()
