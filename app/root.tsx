import {
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse
} from 'react-router'
import type { Route } from './+types/root'
import webmssdk from './assets/douyin/webmssdk?url'
import Login from './login'
import { useEffect, useState, type ReactNode } from 'react'
import Database from '@tauri-apps/plugin-sql'
import zhCN from 'antd/locale/zh_CN'
import LayoutConents from './Layout'

import globalscss from './globals.scss?url'
import { ConfigProvider } from 'antd'
import theme from './theme/adtd'

const TOKEN_STATUS = ['isToken', 'isTokerSuccess', 'isToktonErr'] as const

export type TOKEN_STATUS_KEYS = (typeof TOKEN_STATUS)[number]

export function HydrateFallback() {
  return (
    <div id="loading-splash">
      <div id="loading-splash-spinner" />
      <p>Loading, please wait...</p>
    </div>
  )
}

const TokenStatusCom: {
  [key in TOKEN_STATUS_KEYS]: ReactNode
} = {
  isToktonErr: <Login />,
  isTokerSuccess: (
    <LayoutConents>
      <Outlet />
    </LayoutConents>
  ),

  isToken: <HydrateFallback />
}

export type User = {
  id: number
  username: string
  password: string
  status: TOKEN_STATUS_KEYS
}

export default function App() {
  const [isToken, setisToken] = useState<TOKEN_STATUS_KEYS>('isToken')
  async function getUsers() {
    try {
      const db = await Database.load('sqlite:test.db')
      const dbUsers = await db.select<User[]>('SELECT * FROM users')
      if (dbUsers.some(e => e.status === 'isTokerSuccess')) {
        setisToken('isTokerSuccess')
      } else {
        setisToken('isToktonErr')
      }
    } catch (error) {
      console.log(error)
      setisToken('isTokerSuccess')
    }
  }
  useEffect(() => {
    getUsers()
  }, [])

  return (
    <>
      <div id="detail">{TokenStatusCom[isToken]}</div>
    </>
  )
}

// The Layout component is a special export for the root route.
// It acts as your document's "app shell" for all route components, HydrateFallback, and ErrorBoundary
// For more information, see https://reactrouter.com/explanation/special-files#layout-export
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href={globalscss} />
        <script src={webmssdk} async></script>
      </head>
      <body>
        <ConfigProvider theme={theme} locale={zhCN}>
          {children}
          <ScrollRestoration />
          <Scripts />
        </ConfigProvider>
      </body>
    </html>
  )
}

// The top most error boundary for the app, rendered when your app throws an error
// For more information, see https://reactrouter.com/start/framework/route-module#errorboundary
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = 'Oops!'
  let details = 'An unexpected error occurred.'
  let stack: string | undefined

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? '404' : 'Error'
    details =
      error.status === 404
        ? 'The requested page could not be found.'
        : error.statusText || details
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message
    stack = error.stack
  }

  return (
    <main id="error-page">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre>
          <code>{stack}</code>
        </pre>
      )}
    </main>
  )
}
