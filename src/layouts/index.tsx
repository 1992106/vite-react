import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { renderRoutes, RouteConfigComponentProps } from 'react-router-config'
import { Layout } from 'antd'
import MySider from '@/src/layouts/Sider'
import MyHeader from '@/src/layouts/Header'
import MyFooter from '@/src/layouts/Footer'

const LayoutComponent: React.FC<RouteConfigComponentProps> = ({ route }) => {
  const [collapsed, setCollapsed] = useState(false)

  const onToggle = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Layout>
      <MySider collapsed={collapsed} />
      <Layout>
        <MyHeader collapsed={collapsed} onToggle={onToggle} />
        <Layout.Content>{renderRoutes(route?.routes)}</Layout.Content>
        <MyFooter />
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
