import { createBrowserRouter } from 'react-router'
import App from './App'
import Pages from '~/pages/home'
import Douyin from '~/pages/douyin/home'
import Login from './login'
import Sole from './pages/douyin/sole'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: 'pages',
        element: <Pages />
      },
      {
        path: 'douyin',
        element: <Douyin />
      }
    ]
  },
  {
    path: 'douyin_sole',
    element: <Sole />
  },
  {
    path: 'login',
    element: <Login />
  }
])
