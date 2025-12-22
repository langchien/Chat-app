import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'
import { APP_PAGES } from './constants/link.const'

export default [
  index('features/home/welcome.tsx'),
  layout('layouts/unauthenticated-layout.tsx', [
    route(APP_PAGES.SIGNUP, 'features/auth/pages/signup.tsx'),
    route(APP_PAGES.SIGNIN, 'features/auth/pages/signin.tsx'),
    route(APP_PAGES.FORGOT_PASSWORD, 'features/auth/pages/forgot-password.tsx'),
    route(APP_PAGES.RESET_PASSWORD, 'features/auth/pages/reset-password.tsx'),
    route(APP_PAGES.VERIFY_EMAIL, 'features/auth/pages/verify-email.tsx'),
    route(APP_PAGES.GOOGLE_OAUTH2, 'features/auth/pages/google-redirect.tsx'),
  ]),
  layout('layouts/authenticated-layout.tsx', [
    ...prefix(APP_PAGES.CHAT, [
      index('features/chat/pages/chat-home.tsx'),
      route(':chatId', 'features/chat/pages/chat.tsx'),
    ]),
    route(APP_PAGES.FRIENDS, 'features/friend/pages/friend-layout.tsx', [
      index('features/friend/pages/list.tsx'),
      route('add', 'features/friend/pages/add.tsx'),
      route('request', 'features/friend/pages/request.tsx'),
      route('receive', 'features/friend/pages/receive.tsx'),
    ]),
  ]),
] satisfies RouteConfig
