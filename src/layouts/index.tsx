import React, { useMemo, useState } from 'react'
import PropTypes from 'prop-types'
// import { Redirect } from 'react-router-dom'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { Layout } from 'antd'
import { useSelector } from 'react-redux'
import { selectUser } from '@/store/user'
import AppSider from './Sider'
import AppHeader from './Header'
import AppFooter from './Footer'
import './index.less'

const LayoutComponent: React.FC<RouteConfigComponentProps> = ({ route }) => {
  const [collapsed, setCollapsed] = useState(false)

  const onToggle = () => {
    setCollapsed(!collapsed)
  }

  // TODO: 主账号只显示账号管理，子账号反之
  const { userInfo } = useSelector(selectUser)
  const routes = useMemo(() => {
    const routes = route?.routes || []
    // 路由白名单
    const whiteRoutes = ['/', '*', '/dashboard']
    // const path = (routes || []).find((val) => val?.path === '/')
    if (userInfo.accountType === 'MASTER') {
      // if (path && routes.some((val) => val?.path === '/account')) {
      //   path.render = () => <Redirect to='/account/sub-account' />
      // }
      // @ts-ignore
      return routes.filter((item) => [...whiteRoutes, '/account'].includes(item?.path))
    } else {
      // if (path && routes.some((val) => val?.path === '/order')) {
      //   path.render = () => <Redirect to='/order/order-list' />
      // }
      // @ts-ignore
      return routes.filter((item) => [...whiteRoutes, '/order'].includes(item?.path))
    }
  }, [route, userInfo])

  return (
    <Layout className='app-layout'>
      <AppSider collapsed={collapsed} routes={routes} />
      <Layout>
        <AppHeader collapsed={collapsed} onToggle={onToggle} routes={routes} />
        <Layout.Content className='app-content'>{renderRoutes(routes)}</Layout.Content>
        <AppFooter />
      </Layout>
    </Layout>
  )
}

LayoutComponent.propTypes = {
  route: PropTypes.shape({
    routes: PropTypes.any
  })
}

export default LayoutComponent
