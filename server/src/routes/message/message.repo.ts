import { databaseService } from '@/lib/database.service'
import { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import { Collection, ObjectId } from 'mongodb'
import {
  ICreateMessageInput,
  IMessageCollection,
  IUpdateMessageInput,
  MessageCollection,
  UpdateMessage,
} from './message.db'
import {
  GetMessageResDto,
  ICreateMessageResDto,
  IGetMessageResDto,
  IMessagePaginateCursorRes,
} from './message.res.dto'
import { Message } from './message.schema'

class MessageRepo {
  private get collection(): Collection<IMessageCollection> {
    return databaseService.db.collection('messages')
  }

  async create(data: ICreateMessageInput): Promise<ICreateMessageResDto> {
    const parsedData = MessageCollection.parse(data)
    const result = await this.collection.insertOne(parsedData)
    return Message.parse({
      _id: result.insertedId,
      ...parsedData,
    })
  }

  async update(id: string, data: IUpdateMessageInput): Promise<ICreateMessageResDto | null> {
    const parsedData = UpdateMessage.parse(data)
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
    return Message.parse(result)
  }

  async findOneById(id: string): Promise<IGetMessageResDto | null> {
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
    return result.length > 0 ? GetMessageResDto.parse(result[0]) : null
  }

  async findAllByChatId(chatId: string, limit: number): Promise<IGetMessageResDto[]> {
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
    return results.map((result) => GetMessageResDto.parse(result))
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  }

  async searchByText(query: string): Promise<IGetMessageResDto[]> {
    const results = await this.collection
      .find({ $text: { $search: query } })
      .sort({ _id: -1 })
      .toArray()
    return results.map((result) => Message.parse(result))
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
    const nextCursor = hasMore ? results[limit - 1]._id.toString() : undefined
    return {
      hasMore,
      nextCursor,
      data: results.slice(0, limit).map((result) => GetMessageResDto.parse(result)),
    }
  }
}

export const messageRepo = new MessageRepo()
