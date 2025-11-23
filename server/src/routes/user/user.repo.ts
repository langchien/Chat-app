import { databaseService } from '@/lib/database.service'
import { logger } from '@/lib/logger.service'
import { Collection, ObjectId } from 'mongodb'
import { IUpdateUserInput, IUser, IUserCollection, UpdateUser, UserCollection } from './user.db'
import { User } from './user.schema'

class UserRepo {
  private get collection(): Collection<IUserCollection> {
    return databaseService.db.collection('users')
  }

  async create(data: IUserCollection): Promise<IUser> {
    const parsedData = UserCollection.parse(data)
    const result = await this.collection.insertOne(parsedData)
    return User.parse({
      _id: result.insertedId,
      ...parsedData,
    })
  }

  async update(id: string, data: IUpdateUserInput): Promise<IUser | null> {
    const parsedData = UpdateUser.parse(data)
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
    return User.parse(result)
  }

  async findOneById(id: string): Promise<IUser | null> {
    const result = await this.collection.findOne({ _id: new ObjectId(id) })
    if (!result) return null
    return User.parse(result)
  }

  async findOneByEmail(email: string): Promise<IUser | null> {
    const result = await this.collection.findOne({ email })
    if (!result) return null
    return User.parse(result)
  }

  async findOneByUsername(username: string): Promise<IUser | null> {
    const result = await this.collection.findOne({ username })
    if (!result) return null
    return User.parse(result)
  }

  async findAll(): Promise<IUser[]> {
    const results = await this.collection.find().sort({ _id: -1 }).toArray()
    return results.map((result) => User.parse(result))
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) })
    return result.deletedCount === 1
  }

  async searchByText(query: string): Promise<IUser[]> {
    const results = await this.collection
      .find({ $text: { $search: query } })
      .sort({ _id: -1 })
      .toArray()
    return results.map((result) => User.parse(result))
  }

  async initIndexes(): Promise<void> {
    const indexes = await this.collection.indexes()
    const hasEmailIndex = indexes.some((index) => index.name === 'email_1')
    const hasCreatedAtIndex = indexes.some((index) => index.name === 'createdAt_-1')
    const hasUsernameIndex = indexes.some((index) => index.name === 'username_1')
    const hasTextIndex = indexes.some(
      (index) => index.name === 'email_text_displayName_text_username_text',
    )
    if (!hasEmailIndex) {
      await this.collection.createIndex({ email: 1 }, { unique: true })
      logger.info('Tạo index email_1 cho collection users')
    }
    if (!hasCreatedAtIndex) {
      await this.collection.createIndex({ createdAt: -1 })
      logger.info('Tạo index createdAt_-1 cho collection users')
    }
    if (!hasUsernameIndex) {
      await this.collection.createIndex({ username: 1 }, { unique: true })
      logger.info('Tạo index username_1 cho collection users')
    }
    if (!hasTextIndex) {
      await this.collection.createIndex({ email: 'text', displayName: 'text', username: 'text' })
      logger.info('Tạo text index email_text_displayName_text_username_text cho collection users')
    }
  }
}

export const userRepo = new UserRepo()
