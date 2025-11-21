import { envConfig } from '@/config/env-config'
import { userRepo } from '@/routes/user/user.repo'
import { Db, MongoClient } from 'mongodb'
import { logger } from './logger.service'

/**
 * @description Áp dụng Singleton pattern để quản lý một instance duy nhất của DatabaseService
 */
class DatabaseService {
  private static instance: DatabaseService
  private client: MongoClient
  private _db: Db | null = null
  private constructor() {
    this.client = new MongoClient(envConfig.dbUri)
  }
  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService()
    }
    return DatabaseService.instance
  }

  public async connect(): Promise<void> {
    try {
      await this.client.connect()
      this._db = this.client.db(envConfig.dbName)
      await this._db.command({ ping: 1 })
      logger.success('Kết nối đến MongoDB thành công.')
    } catch (error) {
      logger.error('Lỗi kết nối đến MongoDB:', error)
      throw error
    }
  }

  public get db(): Db {
    if (!this._db) {
      throw new Error(
        'Kết nối đến database chưa được thiết lập, vui lòng gọi connect() trước tiên.',
      )
    }
    return this._db
  }

  public async close(): Promise<void> {
    if (this.client) {
      await this.client.close()
      this._db = null
      logger.info('MongoDB connection closed.')
    }
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await DatabaseService.getInstance().close()
  process.exit(0)
})

export const databaseService = DatabaseService.getInstance()

export const initIndexesDb = async (): Promise<void> => {
  await userRepo.initIndexes()
}
