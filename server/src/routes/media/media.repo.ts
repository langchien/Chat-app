import { BaseRepository } from '@/lib/database'
import { ICreateMediaInput, IMedia, IUpdateMediaInput } from './media.db'

class MediaRepo extends BaseRepository {
  async create(data: ICreateMediaInput): Promise<IMedia> {
    return this.prismaService.media.create({
      data: data,
    })
  }

  async createMany(data: ICreateMediaInput[]): Promise<IMedia[]> {
    await this.prismaService.media.createMany({
      data: data,
    })
    return this.prismaService.media.findMany({
      where: { url: { in: data.map((d) => d.url) } },
    })
  }

  async update(id: string, data: IUpdateMediaInput): Promise<IMedia> {
    return this.prismaService.media.update({
      where: { id: id },
      data: data,
    })
  }

  async findOneById(id: string): Promise<IMedia | null> {
    return this.prismaService.media.findUnique({
      where: { id: id },
    })
  }

  async findAll(): Promise<IMedia[]> {
    return this.prismaService.media.findMany({
      orderBy: { id: 'desc' },
    })
  }

  async delete(id: string): Promise<IMedia> {
    return this.prismaService.media.delete({
      where: { id: id },
    })
  }
}

export const mediaRepo = new MediaRepo()
