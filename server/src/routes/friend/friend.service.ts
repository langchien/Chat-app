import { BadRequestException, ConflictException, NotFoundException } from '@/core/exceptions'
import {
  BaseService,
  isForeignKeyConstraintError,
  isRecordNotFoundError,
  isUniqueConstraintError,
} from '@/lib/database'
import { IUser } from '../user/user.db'
import { ICreateFriendRequestInput, IFriend, IFriendRequest } from './friend.db'
import { FriendStatus } from './friend.res.dto'
import { FriendRequestStatus } from './friend.schema'

class FriendService extends BaseService {
  async createFriendRequest(data: ICreateFriendRequestInput): Promise<IFriendRequest> {
    if (data.fromId === data.toId)
      throw new BadRequestException(undefined, 'Không thể gửi lời mời kết bạn với chính mình')
    try {
      return await this.prismaService.friendRequest.create({
        data,
      })
    } catch (error) {
      if (isUniqueConstraintError(error)) throw new ConflictException('Lời mời kết bạn đã tồn tại')
      if (isForeignKeyConstraintError(error))
        throw new NotFoundException('Không tìm thấy người dùng')
      throw error
    }
  }

  async deleteFriendRequest(requestId: string, toId: string): Promise<IFriendRequest> {
    try {
      return await this.prismaService.friendRequest.delete({
        where: { id: requestId, toId },
      })
    } catch (error) {
      if (isRecordNotFoundError(error))
        throw new NotFoundException('Không tìm thấy lời mời kết bạn')
      throw error
    }
  }
  getReceivedFriendRequests(toId: string): Promise<IFriendRequest[]> {
    return this.prismaService.friendRequest.findMany({
      where: {
        toId,
      },
      include: {
        from: true,
      },
    })
  }

  getSentFriendRequests(fromId: string): Promise<IFriendRequest[]> {
    return this.prismaService.friendRequest.findMany({
      where: {
        fromId,
      },
      include: {
        to: true,
      },
    })
  }

  async acceptFriendRequest(
    requestId: string,
    userAcceptId: string,
  ): Promise<{ friend: IFriend; friendRequest: IFriendRequest }> {
    const request = await this.prismaService.friendRequest.findUnique({
      where: { id: requestId, status: FriendRequestStatus.pending, toId: userAcceptId },
    })
    if (!request) throw new NotFoundException('Không tìm thấy lời mời kết bạn')
    return this.prismaService.$transaction(async (prisma) => {
      const [friendRequest, friend] = await Promise.all([
        prisma.friendRequest.update({
          where: { id: requestId },
          data: { status: FriendRequestStatus.accepted },
        }),
        prisma.friend.create({
          data: {
            userId: userAcceptId,
            friendId: request.fromId,
          },
        }),
        prisma.friend.create({
          data: {
            userId: request.fromId,
            friendId: userAcceptId,
          },
        }),
      ])
      return { friend, friendRequest }
    })
  }

  async rejectFriendRequest(requestId: string, toId: string): Promise<IFriendRequest> {
    try {
      return await this.prismaService.friendRequest.update({
        where: { id: requestId, toId },
        data: { status: FriendRequestStatus.rejected },
      })
    } catch (error) {
      if (isRecordNotFoundError(error))
        throw new NotFoundException('Không tìm thấy lời mời kết bạn')
      throw error
    }
  }

  // todo: Phân trang
  async getAllFriend(userId: string): Promise<IUser[]> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        friends: {
          include: {
            friend: true,
          },
        },
      },
    })
    return user.friends.map((friend) => friend.friend)
  }

  async unfriend(userAId: string, userBId: string): Promise<void> {
    try {
      await this.prismaService.$transaction(async (prisma) => {
        await Promise.all([
          prisma.friend.delete({
            where: {
              userId_friendId: {
                userId: userAId,
                friendId: userBId,
              },
            },
          }),
          prisma.friend.delete({
            where: {
              userId_friendId: {
                userId: userBId,
                friendId: userAId,
              },
            },
          }),
          prisma.friendRequest.deleteMany({
            where: {
              OR: [
                {
                  fromId: userAId,
                  toId: userBId,
                },
                {
                  fromId: userBId,
                  toId: userAId,
                },
              ],
            },
          }),
        ])
      })
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException('Không tìm thấy bạn bè')
      throw error
    }
  }

  async getFriendStatus(myId: string, otherId: string): Promise<FriendStatus> {
    if (myId === otherId) return FriendStatus.NOT_FRIEND

    // 1. Check if friends
    const isFriend = await this.prismaService.friend.findUnique({
      where: {
        userId_friendId: {
          userId: myId,
          friendId: otherId,
        },
      },
      select: { id: true },
    })
    if (isFriend) return FriendStatus.FRIEND

    // 2. Check for pending request sent by me
    const requestSent = await this.prismaService.friendRequest.findFirst({
      where: {
        fromId: myId,
        toId: otherId,
        status: FriendRequestStatus.pending,
      },
      select: { id: true },
    })
    if (requestSent) return FriendStatus.REQUEST_SENT

    // 3. Check for pending request received from them
    const requestReceived = await this.prismaService.friendRequest.findFirst({
      where: {
        fromId: otherId,
        toId: myId,
        status: FriendRequestStatus.pending,
      },
      select: { id: true },
    })
    if (requestReceived) return FriendStatus.REQUEST_RECEIVED

    return FriendStatus.NOT_FRIEND
  }
}

export const friendService = new FriendService()
