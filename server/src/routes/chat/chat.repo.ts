import { databaseService } from '@/lib/database.service'
import { IPaginateCursorQuery } from '@/lib/paginate-cusor.ctrl'
import { Collection, ObjectId } from 'mongodb'
import { userRepo } from '../user/user.repo'
import {
  ChatCollection,
  IChat,
  IChatCollection,
  ICreateChatInp,
  IUpdateChatInp,
  UpdateChat,
} from './chat.db'
import { ChatResDto, IChatPaginateCursorResDto, IChatResDto } from './chat.res.dto'
import { Chat } from './chat.schema'

class ChatRepo {
  private get collection(): Collection<IChatCollection> {
    return databaseService.db.collection('chats')
  }

  async create(data: ICreateChatInp): Promise<IChatResDto> {
    const parsedData = ChatCollection.parse(data)
    const participantIds = parsedData.participants.map((p) => p.userId.toString())
    const users = await userRepo.findAll(participantIds)
    const result = await this.collection.insertOne(parsedData)
    return ChatResDto.parse({
      _id: result.insertedId,
      ...parsedData,
      participants: users.map((user) => ({
        user,
      })),
    })
  }

  async update(id: string, data: IUpdateChatInp): Promise<IChatResDto | null> {
    const parsedData = UpdateChat.parse(data)
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
    // todo: Chưa xử lý phần participants khi update
    return Chat.parse(result)
  }

  async findOneById(id: string, userId?: string): Promise<IChatResDto | null> {
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
    return results.length > 0 ? ChatResDto.parse(results[0]) : null
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
    return results.map((result) => Chat.parse(result))
  }

  async getChatsByCursor(
    userId: string,
    query: IPaginateCursorQuery,
  ): Promise<IChatPaginateCursorResDto> {
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
    const nextCursor = hasMore ? results[limit - 1]._id.toString() : null
    return {
      hasMore,
      nextCursor,
      data: results.slice(0, limit).map((result) => ChatResDto.parse(result)),
    }
  }
}

export const chatRepo = new ChatRepo()
