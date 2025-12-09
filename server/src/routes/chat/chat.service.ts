import { NotFoundException } from '@/core/exceptions'
import { BaseService } from '@/lib/database'
import { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import { IChatIncludeParticipants, ICreateChatInp, IParticipant, IUpdateChatInp } from './chat.db'
import { ChatResDto, IChatPaginateCursorResDto } from './chat.res.dto'
import { ChatType } from './chat.schema'

class ChatService extends BaseService {
  async create(data: ICreateChatInp): Promise<IChatIncludeParticipants> {
    const { receiverIds, ...restData } = data
    const users = await this.prismaService.user.findMany({
      where: { id: { in: receiverIds } },
    })
    if (users.length !== receiverIds.length) throw new NotFoundException('Người dùng không tồn tại')
    return this.prismaService.chat.create({
      data: {
        ...restData,
        participants: {
          createMany:
            users.length > 0 ? { data: users.map((user) => ({ userId: user.id })) } : undefined,
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })
  }

  async update(id: string, data: IUpdateChatInp): Promise<IChatIncludeParticipants> {
    return this.prismaService.chat.update({
      where: { id: id },
      data: data,
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })
  }

  updateParticipantsNickname(id: string, nickname: string): Promise<IParticipant> {
    return this.prismaService.participant.update({
      where: { id },
      data: { nickname: nickname },
    })
  }

  async findOneById(id: string, userId: string): Promise<IChatIncludeParticipants | null> {
    return this.prismaService.chat.findUnique({
      where: { id: id, participants: { some: { userId: userId } } },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })
  }

  async delete(id: string) {
    return this.prismaService.chat.delete({ where: { id: id } })
  }

  async getAllChatsByUserId(userId: string): Promise<IChatIncludeParticipants[]> {
    return this.prismaService.chat.findMany({
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
    })
  }

  async getChatsByCursor(
    userId: string,
    query: IPaginateCursorQuery,
  ): Promise<IChatPaginateCursorResDto> {
    const { cursor, limit } = query
    const results = await this.prismaService.chat.findMany({
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
        ...(cursor ? { id: { lt: cursor } } : {}),
      },
      orderBy: {
        id: 'desc',
      },
      take: limit + 1,
    })
    const hasMore = results.length > limit
    const nextCursor = hasMore ? results[limit - 1].id.toString() : null
    return {
      hasMore,
      nextCursor,
      data: results.slice(0, limit).map((result) => ChatResDto.parse(result)),
    }
  }
  async getOrCreateChatByUserId(
    userId: string,
    currentUserId: string,
  ): Promise<{
    chat: IChatIncludeParticipants
    isCreate: boolean
  }> {
    const chat = await this.prismaService.chat.findFirst({
      where: {
        type: ChatType.DIRECT,
        AND: [
          {
            participants: {
              some: {
                userId,
              },
            },
          },
          {
            participants: {
              some: {
                userId: currentUserId,
              },
            },
          },
        ],
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })
    if (chat) return { chat, isCreate: false }
    const newChat = await this.prismaService.chat.create({
      data: {
        type: ChatType.DIRECT,
        participants: {
          create: [{ userId: currentUserId }, { userId }],
        },
      },
      include: {
        participants: {
          include: {
            user: true,
          },
        },
      },
    })
    return { chat: newChat, isCreate: true }
  }
}

export const chatService = new ChatService()
