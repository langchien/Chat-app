import { envConfig } from '@/config/env-config'
import { createClient, RedisClientType } from 'redis'
import { logger } from './logger.service'

// Singleton Redis Service
class RedisService {
  private static instance: RedisService
  private client: RedisClientType
  private constructor() {
    this.client = createClient({
      url: envConfig.redisUrl,
    })
  }
  static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService()
    }
    return RedisService.instance
  }

  async connect() {
    this.client.on('error', (err) => logger.error('Lỗi kết nối Redis:', err))
    await this.client.connect()
    logger.success('Đã kết nối đến Redis thành công')
  }
  async disconnect(): Promise<void> {
    this.client.destroy()
  }
  // các phương thức redis cơ bản, ví dụ get, set, del các phương thức khác chưa biết áp dụng
  async get(key: string): Promise<string | null> {
    return this.client.get(key)
  }
  async set(key: string, value: string, expireInSeconds?: number): Promise<void> {
    if (expireInSeconds) await this.client.setEx(key, expireInSeconds, value)
    else await this.client.set(key, value)
  }
  async del(key: string): Promise<void> {
    await this.client.del(key)
  }
  async flushAll(): Promise<void> {
    await this.client.flushAll() // xóa tất cả dữ liệu trong Redis
  }
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key)
    return result === 1
  }
  async getExpire(key: string): Promise<number> {
    return this.client.ttl(key)
  }
  // Set operations: add, members, remove
  /**
   * @description Thêm một phần tử vào Set
   */
  async sAdd(key: string, member: string): Promise<number> {
    return this.client.sAdd(key, member)
  }
  /**
   * @description Lấy tất cả các phần tử trong Set
   */
  async sMembers(key: string): Promise<string[]> {
    return this.client.sMembers(key)
  }
  /**
   * @description Xóa một phần tử khỏi Set
   */
  async sRem(key: string, member: string): Promise<number> {
    return this.client.sRem(key, member)
  }

  /**
   *  @description Đặt thời gian hết hạn cho một key theo thời điểm cụ thể (unix timestamp)
   */
  async expireAt(key: string, unixSeconds: number): Promise<void> {
    await this.client.expireAt(key, unixSeconds)
  }
  /**
   * @description Trả về một đối tượng Multi để thực hiện các lệnh Redis theo lô
   * @description Dùng cái này đẻ gom nhiều lệnh redis lại với nhau rồi exec một lần cho tiết kiệm kết nối
   */
  multi(): any {
    return this.client.multi()
  }
}
export const redisService = RedisService.getInstance()
