import { databaseService } from '@/lib/database.service'
import { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import { Collection, ObjectId } from 'mongodb'
import {
  ChatDetailsResSchema,
  IChatDetailsResDto,
  IChatPaginateCursorRes,
  IChatResDto,
} from './chat.res.dto'
import {
  ChatCollSchema,
  ChatSchemma,
  IChat,
  IChatCollection,
  ICreateChatInp,
  IUpdateChatInp,
  UpdateChatSchema,
} from './chat.schema'

class ChatRepo {
  private get collection(): Collection<IChatCollection> {
    return databaseService.db.collection('chats')
  }

  async create(data: ICreateChatInp): Promise<IChatResDto> {
    const parsedData = ChatCollSchema.parse(data)
    const result = await this.collection.insertOne(parsedData)
    return ChatSchemma.parse({
      _id: result.insertedId,
      ...parsedData,
    })
  }

  async update(id: string, data: IUpdateChatInp): Promise<IChatResDto | null> {
    const parsedData = UpdateChatSchema.parse(data)
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
    return ChatSchemma.parse(result)
  }

  async findOneById(id: string, userId?: string): Promise<IChatDetailsResDto | null> {
    const pipeline: any[] = [
      {
        $match: {
          _id: new ObjectId(id),
          ...(userId ? { 'participants.userId': new ObjectId(userId) } : {}),
        },
      },
      { $unwind: '$participants' },
      {
        $lookup: {
          from: 'users',
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          participants: {
            user: '$userInfo',
            nickName: '$participants.nickName',
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          lastMessage: { $first: '$lastMessage' },
          participants: { $push: '$participants' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
        },
      },
    ]
    const results = await this.collection.aggregate(pipeline).toArray()
    return results.length > 0 ? ChatDetailsResSchema.parse(results[0]) : null
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  }

  async searchByText(query: string): Promise<IChat[]> {
    const results = await this.collection
      .find({ $text: { $search: query } })
      .sort({ _id: -1 })
      .toArray()
    return results.map((result) => ChatSchemma.parse(result))
  }

  async getChatsByCursor(
    userId: string,
    query: IPaginateCursorQuery,
  ): Promise<IChatPaginateCursorRes> {
    const { cursor, limit } = query
    const pipeline: any[] = [
      {
        $match: {
          'participants.userId': new ObjectId(userId),
          ...(cursor ? { _id: { $lt: new ObjectId(cursor) } } : {}),
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit + 1 },
      { $unwind: '$participants' },
      {
        $lookup: {
          from: 'users',
          localField: 'participants.userId',
          foreignField: '_id',
          as: 'userInfo',
        },
      },
      { $unwind: { path: '$userInfo', preserveNullAndEmptyArrays: true } },
      {
        $addFields: {
          participants: {
            user: '$userInfo',
            nickName: '$participants.nickName',
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          lastMessage: { $first: '$lastMessage' },
          participants: { $push: '$participants' },
          createdAt: { $first: '$createdAt' },
          updatedAt: { $first: '$updatedAt' },
        },
      },
    ]
    const results = await this.collection.aggregate(pipeline).toArray()
    const hasMore = results.length > limit
    return {
      hasMore,
      data: results.slice(0, limit).map((result) => ChatDetailsResSchema.parse(result)),
    }
  }
}

export const chatRepo = new ChatRepo()
