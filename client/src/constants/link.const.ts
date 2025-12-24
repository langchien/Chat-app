export const APP_PAGES = {
  WELCOME: '/',
  VERIFY_EMAIL: '/auth/signup/email',
  SIGNIN: '/auth/signin',
  SIGNUP: '/auth/signup',
  GOOGLE_OAUTH2: '/oauth2/google/redirect',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  CHAT: '/chat',
  FRIENDS: '/friends',
  ADD_FRIENDS: '/friends/add',
  FRIEND_REQUEST: '/friends/request',
  FRIEND_REQUEST_RECEIVE: '/friends/receive',
} as const

export type AppPages = (typeof APP_PAGES)[keyof typeof APP_PAGES]

export const APP_IMAGES = {
  AVATAR_DEFAULT: '/avatar.jpg',
} as const
