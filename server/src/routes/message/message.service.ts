import { NotFoundException } from '@/core/exceptions'
import { BaseService, isRecordNotFoundError } from '@/lib/database'
import { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import { IChatResDto } from '../chat/chat.res.dto'
import { ICreateMessageInput, IMessage, IUpdateMessageInput } from './message.db'
import { IMessagePaginateCursorResDto, IMessageResDto, MessageResDto } from './message.res.dto'

class MessageService extends BaseService {
  async create(data: ICreateMessageInput): Promise<{ message: IMessageResDto; chat: IChatResDto }> {
    const { mediaIds, ...rest } = data
    const [message, chat] = await this.prismaService.$transaction([
      this.prismaService.message.create({
        data: {
          ...rest,
          medias: {
            connect: mediaIds?.map((mediaId) => ({ id: mediaId })),
          },
        },
        include: {
          medias: true,
        },
      }),
      this.prismaService.chat.update({
        where: { id: data.chatId },
        data: {
          lastMessage: {
            content: data.content,
            senderId: data.senderId,
            createdAt: new Date(),
          },
        },
        include: {
          participants: {
            include: { user: true },
          },
        },
      }),
    ])
    return {
      message,
      chat,
    }
  }

  async update(id: string, data: IUpdateMessageInput): Promise<IMessageResDto> {
    try {
      const { mediaIds, ...rest } = data
      return await this.prismaService.message.update({
        where: { id },
        data: {
          ...rest,
          medias: {
            connect: mediaIds?.map((mediaId) => ({ id: mediaId })),
          },
        },
        include: {
          medias: true,
        },
      })
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException('Không tìm thấy tin nhắn')
      throw error
    }
  }

  findOneById(id: string): Promise<IMessageResDto | null> {
    return this.prismaService.message.findUnique({
      where: { id },
      include: {
        medias: true,
      },
    })
  }

  async delete(id: string): Promise<IMessage> {
    try {
      return await this.prismaService.message.delete({
        where: { id },
      })
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException('Không tìm thấy tin nhắn')
      throw error
    }
  }

  searchByText(query: string): Promise<IMessageResDto[]> {
    return this.prismaService.message.findMany({
      where: {
        content: { contains: query, mode: 'insensitive' },
      },
      orderBy: { createdAt: 'desc' },
      include: {
        medias: true,
      },
    })
  }

  async getMessagesByCursor(
    chatId: string,
    userId: string,
    query: IPaginateCursorQuery,
  ): Promise<IMessagePaginateCursorResDto> {
    const { cursor, limit } = query
    const participant = await this.prismaService.participant.findUnique({
      where: {
        userId_chatId: {
          userId,
          chatId,
        },
      },
    })
    const deletedAt = participant?.deletedAt

    const results = await this.prismaService.message.findMany({
      where: {
        chatId: chatId,
        ...(deletedAt ? { createdAt: { gt: deletedAt } } : {}),
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        medias: true,
      },
    })
    const hasMore = results.length > limit
    const nextCursor = hasMore ? results[limit - 1].id : null
    return {
      hasMore,
      nextCursor,
      data: results.slice(0, limit).map((result) => MessageResDto.parse(result)),
    }
  }
}

export const messageService = new MessageService()
