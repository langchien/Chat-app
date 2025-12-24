import { AccessTokenPayload } from '@/lib/jwt.service'
import { Server } from 'socket.io'
import { Files } from 'formidable'

/**
 *@description Mở rộng Express Request interface để thêm thuộc tính user và io
 *@description Thuộc tính user sẽ được gán bởi accessTokenValidate middleware
 *@description Thuộc tính io sẽ được gán bởi middleware ở file index.ts
 */
declare global {
  namespace Express {
    interface Request {
      user: AccessTokenPayload
      io: Server
      files?: Files
    }
  }
}
