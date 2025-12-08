import { prismaService } from './prisma.service'

export class BaseService {
  protected prismaService = prismaService
}
