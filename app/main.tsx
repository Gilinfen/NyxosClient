import ReactDOM from 'react-dom/client'
import zhCN from 'antd/locale/zh_CN'
import { ConfigProvider } from 'antd'
import theme from './theme/adtd'

import { RouterProvider } from 'react-router'
import { router } from './routers'
import './globals.scss'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ConfigProvider theme={theme} locale={zhCN}>
    <RouterProvider router={router} />
  </ConfigProvider>
)
