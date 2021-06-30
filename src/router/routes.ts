import { RouteConfig } from 'react-router-config'
import Home from '@/pages/Home'
import Test from '@/pages/Test'

const routesConfig: RouteConfig[] = [
  {
    path: '/',
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
