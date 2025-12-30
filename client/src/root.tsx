import { isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router'

import { useEffect } from 'react'
import type { Route } from './+types/root'
import './app.css'
import { AppLoadingOverlay } from './components/loading'
import { ThemeProvider } from './components/theme/theme-provider'
import { Toaster } from './components/ui/sonner'
import { useAuthStore } from './stores/auth.store'
import { useSocketStore } from './stores/socket.store'

export const links: Route.LinksFunction = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap',
  },
]

export function meta() {
  return [{ title: 'Chat app' }, { name: 'description', content: 'Welcome to Chat app!' }]
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <meta charSet='utf-8' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
          {children}
          <AppLoadingOverlay />
          <Toaster richColors={true} position='top-center' duration={2000} />
        </ThemeProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

import { ActiveCall } from './features/call/components/active-call'
import { IncomingCall } from './features/call/components/incoming-call'
import { CallProvider } from './features/call/context/call.context'

export default function App() {
  const accessToken = useAuthStore((state) => state.accessToken)
  const { connect, disconnect } = useSocketStore()
  useEffect(() => {
    if (accessToken) connect()
    return () => disconnect()
  }, [accessToken, connect, disconnect])

  return (
    <CallProvider>
      <Outlet />
      <IncomingCall />
      <ActiveCall />
    </CallProvider>
  )
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404 ? 'The requested page could not be found.' : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main className='pt-16 p-4 container mx-auto'>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className='w-full p-4 overflow-x-auto'>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
