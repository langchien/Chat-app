import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import process from 'process'
import { logger } from '../logger.service'

class PrismaService extends PrismaClient {
  private static instance: PrismaService
  private constructor() {
    super()
  }

  public static getInstance(): PrismaService {
    if (!PrismaService.instance) {
      PrismaService.instance = new PrismaService()
    }
    return PrismaService.instance
  }

  public async verifyConnection() {
    try {
      await this.$connect()
      logger.success('Database connected successfully.')
    } catch (error) {
      logger.error('Database connection failed:', error)
      await this.$disconnect()
      process.exit(1)
    }
  }
}
export const prismaService = PrismaService.getInstance()
