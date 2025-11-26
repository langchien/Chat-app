import { type RouteConfig, index, layout, route } from '@react-router/dev/routes'
import { APP_PAGES } from './constants/link.const'

export default [
  index('routes/welcome.tsx'),
  layout('routes/unauthenticated/layout.tsx', [
    route(APP_PAGES.SIGNUP, 'routes/unauthenticated/signup.tsx'),
    route(APP_PAGES.SIGNIN, 'routes/unauthenticated/signin.tsx'),
    route(APP_PAGES.FORGOT_PASSWORD, 'routes/unauthenticated/forgot-password.tsx'),
    route(APP_PAGES.RESET_PASSWORD, 'routes/unauthenticated/reset-password.tsx'),
    route(APP_PAGES.VERIFY_EMAIL, 'routes/unauthenticated/verify-email.tsx'),
    route(APP_PAGES.GOOGLE_OAUTH2, 'routes/unauthenticated/google-redirect.tsx'),
  ]),
  layout('routes/private/layout.tsx', [
    route(APP_PAGES.CHAT, 'routes/private/chat-layout.tsx', [
      index('routes/private/chat-home.tsx'),
      route(':chatId', 'routes/private/chat.tsx'),
    ]),
  ]),
] satisfies RouteConfig
