import { SOCKET_EVENTS } from '@/constants/event.const'
import { useRequest } from '@/hooks/use-request'
import { useSocketStore } from '@/stores/socket.store'
import { useCallback, useEffect, useState } from 'react'
import { notificationRequest } from '../services/notification.request'
import type { INotificationResDto } from '../services/notification.res.dto'

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<INotificationResDto[]>([])
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
  const [hasMore, setHasMore] = useState(true)

  const fetchNotifications = useRequest(notificationRequest.getMyNotifications, {
    onSuccess: (data) => {
      if (data.items.length === 0) {
        setHasMore(false)
        return
      }
      setNotifications((prev) => [...prev, ...data.items])
      setNextCursor(data.nextCursor)
      if (!data.nextCursor) {
        setHasMore(false)
      }
    },
  })

  // Initial fetch
  useEffect(() => {
    fetchNotifications(undefined)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMore = () => {
    if (hasMore && nextCursor) {
      fetchNotifications(nextCursor)
    }
  }

  const addNotification = useCallback((newNotification: INotificationResDto) => {
    setNotifications((prev) => [newNotification, ...prev])
  }, [])

  const markAsReadLocally = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)))
  }, [])

  const markAllReadLocally = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
  }, [])

  return {
    notifications,
    loadMore,
    hasMore,
    addNotification,
    markAsReadLocally,
    markAllReadLocally,
  }
}

export const useMarkRead = () => {
  return useRequest(notificationRequest.markAsRead, {})
}

export const useMarkAllRead = () => {
  return useRequest(notificationRequest.markAllRead, {})
}

export const useNotificationSocket = (addNotification: (n: INotificationResDto) => void) => {
  const socket = useSocketStore((state) => state.socket)

  useEffect(() => {
    if (!socket) return

    socket.on(SOCKET_EVENTS.NEW_NOTIFICATION, (newNotification: INotificationResDto) => {
      addNotification(newNotification)
    })

    return () => {
      socket.off(SOCKET_EVENTS.NEW_NOTIFICATION)
    }
  }, [socket, addNotification])
}
