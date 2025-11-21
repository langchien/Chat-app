import { databaseService } from '@/lib/database.service'
import { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import { Collection, ObjectId } from 'mongodb'
import { IMessagePaginateCursorRes, IMessageRes, MessageResSchema } from './message.res.dto'
import {
  ICreateMessageInput,
  IMessageCollection,
  IUpdateMessageInput,
  MessageCollectionSchema,
  MessageSchema,
  UpdateMessageSchema,
} from './message.schema'

class MessageRepo {
  private get collection(): Collection<IMessageCollection> {
    return databaseService.db.collection('messages')
  }

  async create(data: ICreateMessageInput): Promise<IMessageRes> {
    const parsedData = MessageCollectionSchema.parse(data)
    const result = await this.collection.insertOne(parsedData)
    return MessageSchema.parse({
      _id: result.insertedId,
      ...parsedData,
    })
  }

  async update(id: string, data: IUpdateMessageInput): Promise<IMessageRes | null> {
    const parsedData = UpdateMessageSchema.parse(data)
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
    return MessageSchema.parse(result)
  }

  async findOneById(id: string): Promise<IMessageRes | null> {
    const result = await this.collection
      .aggregate([
        { $match: { _id: new ObjectId(id) } },
        {
          $lookup: {
            from: 'media',
            localField: 'mediaId',
            foreignField: '_id',
            as: 'media',
          },
        },
        { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
      ])
      .toArray()
    return result.length > 0 ? MessageResSchema.parse(result[0]) : null
  }

  async findAllByChatId(chatId: string, limit: number): Promise<IMessageRes[]> {
    const results = await this.collection
      .aggregate([
        {
          $match: {
            chatId: new ObjectId(chatId),
          },
        },
        {
          $lookup: {
            from: 'media',
            localField: 'mediaId',
            foreignField: '_id',
            as: 'media',
          },
        },
        {
          $sort: { _id: -1 },
        },
        { $limit: limit },
        { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
      ])
      .toArray()
    return results.map((result) => MessageResSchema.parse(result))
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  }

  async searchByText(query: string): Promise<IMessageRes[]> {
    const results = await this.collection
      .find({ $text: { $search: query } })
      .sort({ _id: -1 })
      .toArray()
    return results.map((result) => MessageSchema.parse(result))
  }

  async getMessagesByCursor(
    chatId: string,
    query: IPaginateCursorQuery,
  ): Promise<IMessagePaginateCursorRes> {
    const { cursor, limit } = query
    const results = await this.collection
      .aggregate([
        {
          $match: {
            _id: cursor ? { $lt: new ObjectId(cursor) } : { $exists: true },
            chatId: new ObjectId(chatId),
          },
        },
        { $sort: { _id: -1 } },
        { $limit: limit + 1 },
        {
          $lookup: {
            from: 'media',
            localField: 'mediaId',
            foreignField: '_id',
            as: 'media',
          },
        },
        { $unwind: { path: '$media', preserveNullAndEmptyArrays: true } },
      ])
      .toArray()
    const hasMore = results.length > limit
    return {
      hasMore,
      data: results.slice(0, limit).map((result) => MessageResSchema.parse(result)),
    }
  }
}

export const messageRepo = new MessageRepo()
