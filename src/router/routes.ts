import { RouteConfig } from 'react-router-config'
import LayoutComponent from '@/src/layouts'
import Home from '@/pages/Home'
import Test from '@/pages/Test'

const routesConfig: RouteConfig[] = [
  {
    path: '/',
    component: LayoutComponent
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
