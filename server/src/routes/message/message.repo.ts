import { BaseRepository } from '@/lib/database'
import { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import { IChatResDto } from '../chat/chat.res.dto'
import { ICreateMessageInput, IMessage, IUpdateMessageInput } from './message.db'
import { IMessagePaginateCursorResDto, IMessageResDto, MessageResDto } from './message.res.dto'

class MessageRepo extends BaseRepository {
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

  update(id: string, data: IUpdateMessageInput): Promise<IMessageResDto> {
    const { mediaIds, ...rest } = data
    return this.prismaService.message.update({
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
  }

  findOneById(id: string): Promise<IMessageResDto | null> {
    return this.prismaService.message.findUnique({
      where: { id },
      include: {
        medias: true,
      },
    })
  }

  delete(id: string): Promise<IMessage> {
    return this.prismaService.message.delete({
      where: { id },
    })
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
    query: IPaginateCursorQuery,
  ): Promise<IMessagePaginateCursorResDto> {
    const { cursor, limit } = query
    const results = await this.prismaService.message.findMany({
      where: {
        chatId: chatId,
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        medias: true,
      },
    })
    const hasMore = results.length > limit
    const nextCursor = hasMore ? results[limit - 1].id : undefined
    return {
      hasMore,
      nextCursor,
      data: results.slice(0, limit).map((result) => MessageResDto.parse(result)),
    }
  }
}

export const messageRepo = new MessageRepo()
