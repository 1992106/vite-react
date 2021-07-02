import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import MyLogo from '../Logo'
import MyMenu from '../Menu'

interface SiderProps {
  collapsed: boolean
  routes?: any[]
}

const SiderComponent: React.FC<SiderProps> = ({ collapsed, routes }) => {
  return (
    <Layout.Sider
      className='app-sider'
      theme='light'
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={64}
      width={200}
    >
      <MyLogo collapsed={collapsed} />
      <MyMenu collapsed={collapsed} routes={routes} />
    </Layout.Sider>
  )
}

SiderComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  routes: PropTypes.array
}

export default SiderComponent
