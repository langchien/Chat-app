import { prismaService } from './prisma.service'

export class BaseRepository {
  protected prismaService = prismaService
}
