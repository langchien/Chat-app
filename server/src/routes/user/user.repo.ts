import { BaseRepository } from '@/lib/database'
import { ICreateUserInput, IUpdateUserInput, IUser } from './user.db'

class UserRepo extends BaseRepository {
  create(data: ICreateUserInput): Promise<IUser> {
    return this.prismaService.user.create({
      data,
    })
  }

  update(id: string, data: IUpdateUserInput): Promise<IUser> {
    return this.prismaService.user.update({
      where: { id },
      data,
    })
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

  delete(id: string): Promise<IUser> {
    return this.prismaService.user.delete({
      where: { id },
    })
  }

  searchByText(query: string, limmit: number = 20): Promise<IUser[]> {
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
}

export const userRepo = new UserRepo()
