import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { Layout } from 'antd'
import AppSider from './Sider'
import AppHeader from './Header'
import AppFooter from './Footer'
import './index.less'

const LayoutComponent: React.FC<RouteConfigComponentProps> = ({ route }) => {
  const routes = route?.routes || []
  const [collapsed, setCollapsed] = useState(false)

  const onToggle = () => {
    setCollapsed(!collapsed)
  }

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
