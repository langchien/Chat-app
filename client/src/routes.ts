import { type RouteConfig, index, route } from '@react-router/dev/routes'
import { APP_PAGES } from './constants/link.const'

export default [
  index('routes/welcome.tsx'),
  route(APP_PAGES.SIGNUP, './routes/signup.tsx'),
  route(APP_PAGES.SIGNIN, './routes/signin.tsx'),
  route(APP_PAGES.FORGOT_PASSWORD, './routes/forgot-password.tsx'),
  route(APP_PAGES.RESET_PASSWORD, './routes/reset-password.tsx'),
  route(APP_PAGES.VERIFY_EMAIL, './routes/verify-email.tsx'),
  route(APP_PAGES.GOOGLE_OAUTH2, './routes/google-redirect.tsx'),
  route(APP_PAGES.CONVERSATIONS, './routes/conversation.layout.tsx', [
    index('./routes/conversation-index.tsx'),
    route(':conversationId', './routes/conversation.tsx'),
  ]),
] satisfies RouteConfig
