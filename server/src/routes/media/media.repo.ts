import { databaseService } from '@/lib/database.service'
import { Collection, ObjectId } from 'mongodb'
import {
  IInsertMediaInput,
  IMedia,
  IMediaCollection,
  IUpdateMediaInput,
  MediaCollectionSchema,
  MediaSchema,
  UpdateMediaSchema,
} from './media.schema'

class MediaRepo {
  get collection(): Collection<IMediaCollection> {
    return databaseService.db.collection('media')
  }

  async create(data: IInsertMediaInput): Promise<IMedia> {
    const parsedData = MediaCollectionSchema.parse(data)
    const result = await this.collection.insertOne(parsedData)
    const obj: IMedia = {
      _id: result.insertedId,
      ...parsedData,
    }
    return obj
  }

  async createMany(data: IInsertMediaInput[]): Promise<IMedia[]> {
    const parsedData = data.map((item) => MediaCollectionSchema.parse(item))
    const result = await this.collection.insertMany(parsedData)
    const objs: IMedia[] = Object.values(result.insertedIds).map((id, index) => ({
      _id: id,
      ...parsedData[index],
    }))
    return objs
  }

  async update(id: string, data: IUpdateMediaInput): Promise<IMedia | null> {
    const parsedData = UpdateMediaSchema.parse(data)
    const result = await this.collection.findOneAndUpdate(
      {
        _id: new ObjectId(id),
      },
      {
        $set: { ...parsedData },
      },
      {
        returnDocument: 'after',
      },
    )
    if (!result) return null
    return MediaSchema.parse({
      id: result._id,
      ...result,
    })
  }

  async findOneById(id: string): Promise<IMedia | null> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) })
    if (!result) return null
    return MediaSchema.parse({
      id: result._id,
      ...result,
    })
  }

  async findAll(): Promise<IMedia[]> {
    const results = await this.collection.find().sort({ _id: -1 }).toArray()
    return results.map((result) =>
      MediaSchema.parse({
        id: result._id,
        ...result,
      }),
    )
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  }
}

export const mediaRepo = new MediaRepo()
