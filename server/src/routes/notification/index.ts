import { accessTokenValidate } from '@/core/access-token.middleware'
import { Router } from 'express'
import { notificationController } from './notification.controller'

const notificationRouter = Router()

notificationRouter.use(accessTokenValidate)

notificationRouter.get('/', notificationController.getMyNotifications)
notificationRouter.patch('/:id/read', notificationController.markAsRead)
notificationRouter.patch('/read-all', notificationController.markAllRead)

export default notificationRouter
