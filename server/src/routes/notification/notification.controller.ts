import { Request, Response } from 'express'
import { notificationService } from './notification.service'

class NotificationController {
  async getMyNotifications(req: Request, res: Response) {
    const { user } = req as any
    const { limit, cursor } = req.query

    const result = await notificationService.getMyNotifications(
      user.id,
      limit ? parseInt(limit as string) : 20,
      cursor as string,
    )

    res.json(result)
  }

  async markAsRead(req: Request, res: Response) {
    const { user } = req as any
    const { id } = req.params

    await notificationService.markAsRead(user.id, id)
    res.json({ message: 'Success' })
  }

  async markAllRead(req: Request, res: Response) {
    const { user } = req as any
    await notificationService.markAllRead(user.id)
    res.json({ message: 'Success' })
  }
}

export const notificationController = new NotificationController()
