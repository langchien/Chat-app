import { httpRequest } from '@/lib/request'

export const API_ROUTES = {
  USER: '/users',
  AUTH: '/auth',
  FRIEND_REQUEST: '/friend-requests',
  OAUTH: '/oauth2',
  PROTECTED: '/protected',
  CHAT: '/chats',
  MESSAGE: '/messages',
  MEDIA: '/media',
} as const

export class ApiRequest {
  protected httpRequest = httpRequest
  constructor(protected basePath: string) {}
}
