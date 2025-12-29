import { httpRequest } from '@/lib/request'

export const API_ROUTES = {
  USER: '/users',
  AUTH: '/auth',
  FRIEND: '/friends',
  OAUTH: '/oauth2',
  PROTECTED: '/protected',
  CHAT: '/chats',
  MESSAGE: '/messages',
  MEDIA: '/media',
  NOTIFICATION: '/notifications',
} as const

export class ApiRequest {
  protected httpRequest = httpRequest
  constructor(protected basePath: string) {}
}
