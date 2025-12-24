import { NotFoundException, UnprocessableEntityException } from '@/core/exceptions'
import { BaseService, isRecordNotFoundError, isUniqueConstraintError } from '@/lib/database'
import { ICreateUserInput, IUpdateUserInput, IUser } from './user.db'

class UserService extends BaseService {
  private handleUniqueConstraintError(error: any) {
    if (isUniqueConstraintError(error)) {
      if ((error.meta as any).target == 'User_email_key')
        throw new UnprocessableEntityException([
          {
            message: 'Email đã được sử dụng',
            path: ['email'],
          },
        ])
      if ((error.meta as any).target == 'User_username_key')
        throw new UnprocessableEntityException([
          {
            message: 'Username đã được sử dụng',
            path: ['username'],
          },
        ])
    }
    throw error
  }

  async create(data: ICreateUserInput): Promise<IUser> {
    try {
      return await this.prismaService.user.create({
        data,
      })
    } catch (error) {
      this.handleUniqueConstraintError(error)
      throw error // Should be unreachable if handleUniqueConstraintError throws
    }
  }

  async update(id: string, data: IUpdateUserInput): Promise<IUser> {
    try {
      return await this.prismaService.user.update({
        where: { id },
        data,
      })
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException('Không tìm thấy người dùng')
      this.handleUniqueConstraintError(error)
      throw error
    }
  }

  findOneById(id: string): Promise<IUser | null> {
    return this.prismaService.user.findUnique({
      where: { id },
    })
  }

  findOneByEmail(email: string): Promise<IUser | null> {
    return this.prismaService.user.findUnique({
      where: { email },
    })
  }

  findOneByUsername(username: string): Promise<IUser | null> {
    return this.prismaService.user.findUnique({
      where: { username },
    })
  }

  findAll(ids?: string[]): Promise<IUser[]> {
    return this.prismaService.user.findMany({
      where: ids ? { id: { in: ids } } : {},
      orderBy: { createdAt: 'desc' },
    })
  }

  async delete(id: string): Promise<IUser> {
    try {
      return await this.prismaService.user.delete({
        where: { id },
      })
    } catch (error) {
      if (isRecordNotFoundError(error)) throw new NotFoundException('Không tìm thấy người dùng')
      throw error
    }
  }

  searchByText(query: string, limmit: number): Promise<IUser[]> {
    return this.prismaService.user.findMany({
      where: {
        OR: [
          { username: { contains: query, mode: 'insensitive' } },
          { displayName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limmit,
    })
  }

  // search excluding a user id
  async searchExcludeFriend(query: string, excludeId: string, limmit: number): Promise<IUser[]> {
    const allFiends = await this.prismaService.friend.findMany({
      select: {
        friendId: true,
        userId: true,
      },
      where: {
        OR: [{ userId: excludeId }, { friendId: excludeId }],
      },
    })
    const excludeIds = allFiends.map((f) => (f.userId === excludeId ? f.friendId : f.userId))
    excludeIds.push(excludeId)
    return this.prismaService.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { username: { contains: query, mode: 'insensitive' } },
              { displayName: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } },
            ],
          },
          { id: { notIn: excludeIds } },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limmit,
    })
  }
}

export const userService = new UserService()
