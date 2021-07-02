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
        name: '首页',
        icon: 'icon-layout'
      },
      {
        path: '/app',
        component: Test,
        name: '测试',
        icon: 'icon-menu'
      }
    ]
  },
  {
    path: '/home',
    component: Home,
    routes: [
      {
        path: '/app',
        component: Test
      }
    ]
  }
]
export default routesConfig
