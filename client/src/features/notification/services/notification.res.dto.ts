import type { Notification } from './notification.schema'

export interface INotificationResDto extends Notification {}

export interface INotificationPaginateCursorResDto {
  items: INotificationResDto[]
  nextCursor?: string
}
