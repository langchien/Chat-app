import { API_ROUTES, ApiRequest } from '@/constants/api-routes'
import type { INotificationPaginateCursorResDto } from './notification.res.dto'

class NotificationRequest extends ApiRequest {
  getMyNotifications = async (cursor?: string, limit = 20) => {
    const res = await this.httpRequest.get<INotificationPaginateCursorResDto>(this.basePath, {
      params: { cursor, limit },
    })
    return res.data
  }

  markAsRead = async (id: string) => {
    await this.httpRequest.patch(`${this.basePath}/${id}/read`)
  }

  markAllRead = async () => {
    await this.httpRequest.patch(`${this.basePath}/read-all`)
  }
}

export const notificationRequest = new NotificationRequest(API_ROUTES.NOTIFICATION)
