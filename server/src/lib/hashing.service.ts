import { compare, genSalt, hash } from 'bcrypt'

const saltRounds = 10

class HashingService {
  async hash(value: string): Promise<string> {
    const salt = await genSalt(saltRounds)
    return hash(value, salt)
  }

  async compare(value: string, hash: string): Promise<boolean> {
    return compare(value, hash)
  }
}

export const hashingService = new HashingService()
