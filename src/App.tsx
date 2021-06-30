import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { renderRoutes } from 'react-router-config'
import routes from '@/src/router/routes'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/es/locale/zh_CN'
import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn')

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>{renderRoutes(routes)}</BrowserRouter>
    </ConfigProvider>
  )
}

export default App
