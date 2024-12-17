import type { RouteConfig } from '@react-router/dev/routes'
import { route } from '@react-router/dev/routes'

export default [
  route('/', 'httpsApp.tsx'),
  route('login', 'login.tsx'),
  route('dbapp', 'dbApp.tsx'),
  route('pages', 'pages/home.tsx'),
  route('douyin', 'pages/douyin/home.tsx')
] satisfies RouteConfig
