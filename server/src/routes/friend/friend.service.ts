import { BaseService } from '@/lib/database'
import { IUser } from '../user/user.db'
import { ICreateFriendRequestInput, IFriend, IFriendRequest } from './friend.db'
import { FriendRequestStatus } from './friend.schema'

class FriendService extends BaseService {
  createFriendRequest(data: ICreateFriendRequestInput): Promise<IFriendRequest> {
    return this.prismaService.friendRequest.create({
      data,
    })
  }

  async acceptFriendRequest(
    requestId: string,
    userAcceptId: string,
  ): Promise<{ friend: IFriend; friendRequest: IFriendRequest }> {
    const request = await this.prismaService.friendRequest.findUniqueOrThrow({
      where: { id: requestId },
    })

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

  rejectFriendRequest(requestId: string): Promise<IFriendRequest> {
    return this.prismaService.friendRequest.update({
      where: { id: requestId },
      data: { status: FriendRequestStatus.rejected },
    })
  }

  async getAllFriend(userId: string): Promise<IUser[]> {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        friends: {
          include: {
            user: true,
          },
        },
      },
    })
    return user.friends.map((friend) => friend.user)
  }

  delete(requestId: string): Promise<IFriendRequest> {
    return this.prismaService.friendRequest.delete({
      where: { id: requestId },
    })
  }
}

export const friendService = new FriendService()
