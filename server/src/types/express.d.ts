import { AccessTokenPayload } from '@/lib/jwt.service'

/**
 *@description Mở rộng Express Request interface để thêm thuộc tính user
 *@description Thuộc tính user sẽ được gán bởi accessTokenValidate middleware
 */
declare global {
  namespace Express {
    interface Request {
      user: AccessTokenPayload
    }
  }
}
