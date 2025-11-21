import { databaseService } from '@/lib/database.service'
import { Collection } from 'mongodb'
import { IOtpRequestCollection, OtpRequestSchema, OtpType } from './otp-request.schema'

export class OtpRepo {
  get collection(): Collection<IOtpRequestCollection> {
    return databaseService.db.collection('otpRequests')
  }
  async updateOne(filter: any, update: any, options: any) {
    return this.collection.updateOne(filter, update, options)
  }

  async findOneAndDelete(filter: any) {
    return this.collection.findOneAndDelete(filter)
  }

  async findByEmailAndType(email: string, type: OtpType) {
    return this.collection.findOne({ email, type })
  }

  async create(data: any) {
    const parsed = OtpRequestSchema.parse(data)
    return this.collection.insertOne(parsed)
  }
}

export const otpRepo = new OtpRepo()
