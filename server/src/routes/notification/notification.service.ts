import { BaseService } from '@/lib/database'
import { socketService } from '@/socket/socket.service'
import { NotificationType } from './notification.schema'

class NotificationService extends BaseService {
  async create(data: {
    recipientId: string
    senderId?: string
    type: NotificationType
    content: string
    link?: string
  }) {
    const notification = await this.prismaService.notification.create({
      data: {
        recipientId: data.recipientId,
        senderId: data.senderId,
        type: data.type,
        content: data.content,
        link: data.link,
      },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    })

    // Emit socket event
    socketService.sendNotification(notification.recipientId, notification)

    return notification
  }

  async getMyNotifications(userId: string, limit = 20, cursor?: string) {
    const notifications = await this.prismaService.notification.findMany({
      where: { recipientId: userId },
      take: limit + 1, // Fetch one extra to check for next page
      cursor: cursor ? { id: cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        sender: {
          select: {
            id: true,
            displayName: true,
            avatarUrl: true,
          },
        },
      },
    })

    let nextCursor: string | undefined = undefined
    if (notifications.length > limit) {
      const nextItem = notifications.pop()
      nextCursor = nextItem?.id
    }

    return {
      items: notifications,
      nextCursor,
    }
  }

  async markAsRead(userId: string, notificationId: string) {
    return this.prismaService.notification.update({
      where: { id: notificationId, recipientId: userId },
      data: { isRead: true },
    })
  }

  async markAllRead(userId: string) {
    return this.prismaService.notification.updateMany({
      where: { recipientId: userId, isRead: false },
      data: { isRead: true },
    })
  }
}

export const notificationService = new NotificationService()
