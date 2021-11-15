import React from 'react'
import { Redirect } from 'react-router-dom'
import { RouteConfig } from 'react-router-config'
import AppLayout from '@/src/layouts'
import BlankComponent from '@/src/layouts/Blank'
import Login from '@/pages/system/Login'
import Forbidden from '@/pages/system/403'
import NotFound from '@/pages/system/404'
import Dashboard from '@/pages/dashboard'
import SupplierSubAccount from '@/pages/accountManagement/supplierSubAccount'
import OrderList from '@/pages/orderManagement/orderList'

const routesConfig: RouteConfig[] = [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/403',
    component: Forbidden
  },
  {
    path: '/404',
    component: NotFound
  },
  {
    path: '/',
    component: AppLayout,
    routes: [
      {
        path: '/',
        exact: true,
        render: () => <Redirect to='/dashboard' />,
        meta: {
          hidden: true
        }
      },
      {
        path: '/dashboard',
        component: Dashboard,
        meta: {
          title: '首页',
          icon: 'icon-dashboard'
          // hidden: true
        }
      },
      {
        path: '/account',
        component: BlankComponent,
        meta: {
          title: '账号管理',
          icon: 'icon-setting'
        },
        routes: [
          {
            path: '/account/sub-account',
            exact: true,
            component: SupplierSubAccount,
            meta: {
              title: '供应商子账号管理'
            }
          }
        ]
      },
      {
        path: '/order',
        component: BlankComponent,
        meta: {
          title: '订单管理',
          icon: 'icon-setting'
        },
        routes: [
          {
            path: '/order/order-list',
            exact: true,
            component: OrderList,
            meta: {
              title: '订单列表'
            }
          }
        ]
      },
      {
        path: '*',
        render: () => <Redirect to='/404' />,
        meta: {
          hidden: true
        }
      }
    ]
  }
]
export default routesConfig
