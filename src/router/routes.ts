import { RouteConfig } from 'react-router-config'
import AppLayout from '@/src/layouts'
import Home from '@/pages/Home'
import Test from '@/pages/Test'

const routesConfig: RouteConfig[] = [
  {
    path: '/',
    component: AppLayout,
    routes: [
      {
        path: '/home',
        component: Home,
        meta: {
          title: '仪表盘',
          icon: 'icon-dashboard'
        }
      },
      {
        path: '/app',
        component: Test,
        meta: {
          title: '测试',
          icon: 'icon-layout'
        }
      }
    ]
  }
]
export default routesConfig
