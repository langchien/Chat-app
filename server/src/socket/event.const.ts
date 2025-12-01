export const SOCKET_EVENTS = {
  ONLINE_USERS: 'online-users',
  SEND_MESSAGE: 'send-message',
  RECEIVE_MESSAGE: 'receive-message',
  // sự kiện chờ xử lý media: client join vào room media id, server emit sự kiện này khi có cập nhật trạng thái xử lý media
  MEDIA_PROCESSING_UPDATE: 'media-processing-update',
  UPDATE_CHAT: 'update-chat',
  DELETE_CHAT: 'delete-chat',
} as const
