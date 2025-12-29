import { NotFoundException } from '@/core/exceptions'
import { BaseService } from '@/lib/database'
import { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import { notificationService } from '../notification/notification.service'
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

  async deleteConversation(chatId: string, userId: string): Promise<IParticipant> {
    return this.prismaService.participant.update({
      where: {
        userId_chatId: {
          chatId,
          userId,
        },
      },
      data: {
        deletedAt: new Date(),
      },
    })
  }

  async updateChatDisplayName(
    chatId: string,
    userId: string,
    displayName: string,
  ): Promise<IChatIncludeParticipants> {
    const chat = await this.findOneById(chatId, userId)
    if (!chat) throw new NotFoundException('Chat không tồn tại')

    const groupInfo = chat.groupInfo
    let result: IChatIncludeParticipants

    if (groupInfo) {
      result = await this.update(chatId, {
        groupInfo: {
          ...groupInfo,
          name: displayName,
        },
      })
    } else {
      const members = chat.participants.filter((p) => p.userId !== userId)
      const member = members[0]
      // Note: This logic seems to assume direct chat has only 2 participants.
      // If it's a direct chat, changing "display name" usually means changing nickname for the OTHER person?
      // Or for the current user?
      // Original code: const members = chat.participants.filter((p) => p.userId !== userId)
      // updatedParticipant = updateParticipantsNickname(member.id, displayName)
      // logical implication: I am renaming the OTHER person in my view?
      // Or renaming myself?
      // Actually typically in direct chat, you nickname the other person.

      const updatedParticipant = await this.updateParticipantsNickname(member.id, displayName)

      // We need to return the full chat with updated participant info simulating the result
      // forcing type cast or refetching. Refetching is safer but one extra query.
      // Let's modify the chat object in memory as original code did.

      result = {
        ...chat,
        participants: chat.participants.map((p) =>
          p.id === updatedParticipant.id ? { ...p, nickname: updatedParticipant.nickname } : p,
        ),
      }
    }
    return result
  }

  async getAllChatsByUserId(userId: string): Promise<IChatIncludeParticipants[]> {
    const chats = await this.prismaService.chat.findMany({
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
    // Filter out chats that are "deleted" for this user
    return chats.filter((chat) => {
      const participant = chat.participants.find((p) => p.userId === userId)
      if (!participant || !participant.deletedAt) return true
      // If last message exists and is newer than deletedAt, show it.
      // If no last message, it's effectively empty or old, hide it if deletedAt is set?
      // Actually if no lastMessage, it might be a new empty chat.
      if (!chat.lastMessage) return false // Or true? Assume if no message, nothing to see?
      // Logic: Show if lastMessage.createdAt > deletedAt
      return new Date(chat.lastMessage.createdAt) > new Date(participant.deletedAt)
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

    // Filter results in memory
    const filteredResults = results.filter((chat) => {
      const participant = chat.participants.find((p) => p.userId === userId)
      if (!participant || !participant.deletedAt) return true
      if (!chat.lastMessage) return false
      return new Date(chat.lastMessage.createdAt) > new Date(participant.deletedAt)
    })

    // Pagination logic adjustment:
    // Since we filtered in memory, we might have fewer items than 'limit'.
    // Properly, we should fetch more, but for simplicity we return what we have.
    // However, 'nextCursor' should be based on the original 'results' to continue traversal effectively
    // OR we return nextCursor of the last item in *filtered* list?
    // If we return nextCursor of original list, the next page will start correctly from DB perspective.

    const hasMore = results.length > limit
    const nextCursor = hasMore ? results[limit - 1].id.toString() : null

    return {
      hasMore,
      nextCursor,
      data: filteredResults.slice(0, limit).map((result) => ChatResDto.parse(result)),
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
  async getLinksInChat(chatId: string) {
    const messages = await this.prismaService.message.findMany({
      where: {
        chatId,
        content: { contains: 'http' },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    const links = messages.flatMap((msg) => {
      const urlRegex = /(https?:\/\/[^\s]+)/g
      const matches = msg.content.match(urlRegex)
      return matches
        ? matches.map((url) => ({
            url,
            messageId: msg.id,
            createdAt: msg.createdAt,
          }))
        : []
    })

    return links
  }

  async getMediaInChat(chatId: string) {
    return this.prismaService.media.findMany({
      where: {
        message: {
          chatId,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  }
  async addParticipants(
    chatId: string,
    userIds: string[],
    actorId: string,
  ): Promise<IChatIncludeParticipants> {
    const chat = await this.prismaService.chat.findUnique({
      where: { id: chatId },
      include: { participants: true },
    })

    if (!chat) throw new NotFoundException('Chat không tồn tại')
    if (chat.type !== ChatType.GROUP)
      throw new NotFoundException('Chỉ có thể thêm thành viên vào nhóm')

    // Check if actor is in the group
    const isActorInGroup = chat.participants.some(
      (p) => p.userId === actorId && (!p.deletedAt || new Date(p.deletedAt) > new Date()),
    )
    if (!isActorInGroup) throw new NotFoundException('Bạn không phải là thành viên của nhóm này')

    // Get all participants including soft deleted ones to check against input userIds
    const allParticipantsInChat = await this.prismaService.participant.findMany({
      where: {
        chatId,
        userId: { in: userIds },
      },
    })

    // 1. Identify users to restore (they exist but have deletedAt)
    const validUserIdsToRestore = allParticipantsInChat
      .filter((p) => p.deletedAt)
      .map((p) => p.userId)

    // 2. Identify users to create (they are not in allParticipantsInChat)
    const existingUserIds = allParticipantsInChat.map((p) => p.userId)
    const validUserIdsToCreate = userIds.filter((id) => !existingUserIds.includes(id))

    // Restore
    if (validUserIdsToRestore.length > 0) {
      await this.prismaService.participant.updateMany({
        where: { chatId, userId: { in: validUserIdsToRestore } },
        data: { deletedAt: null, joinedAt: new Date() },
      })
    }

    // Create
    if (validUserIdsToCreate.length > 0) {
      await this.prismaService.participant.createMany({
        data: validUserIdsToCreate.map((id) => ({ chatId, userId: id })),
      })
    }

    // Create notifications for all added users (restored + created)
    const allAddedUserIds = [...validUserIdsToRestore, ...validUserIdsToCreate]
    if (allAddedUserIds.length > 0) {
      // We can do this in parallel
      await Promise.all(
        allAddedUserIds.map((userId) =>
          notificationService.create({
            recipientId: userId,
            // senderId: actorId, // Or maybe null if system message, but better show who added
            senderId: actorId,
            type: 'ADDED_TO_GROUP',
            content: `đã thêm bạn vào nhóm ${chat.groupInfo?.name || 'chat'}`,
            link: `/chats/${chatId}`,
          }),
        ),
      )
    }

    return this.findOneById(chatId, actorId) as Promise<IChatIncludeParticipants>
  }

  async removeParticipant(
    chatId: string,
    userIdToRemove: string,
    actorId: string,
  ): Promise<IChatIncludeParticipants> {
    const chat = await this.prismaService.chat.findUnique({
      where: { id: chatId },
      include: { participants: true },
    })

    if (!chat) throw new NotFoundException('Chat không tồn tại')
    if (chat.type !== ChatType.GROUP)
      throw new NotFoundException('Chỉ có thể xóa thành viên khỏi nhóm')

    // Permission check: Actor must be Admin OR Actor is removing themselves (Leave Group)
    const isAdmin = chat.groupInfo?.createdBy === actorId
    if (!isAdmin && userIdToRemove !== actorId) {
      throw new NotFoundException('Bạn không có quyền xóa thành viên này')
    }

    // Cannot remove the only admin? Or transfer ownership?
    // For now, if admin leaves, group might be headless or allowed.
    // If admin removes themselves, it's a leave.

    await this.prismaService.participant.update({
      where: { userId_chatId: { chatId, userId: userIdToRemove } },
      data: { deletedAt: new Date() },
    })

    return this.findOneById(chatId, actorId) as Promise<IChatIncludeParticipants>
  }
}

export const chatService = new ChatService()
