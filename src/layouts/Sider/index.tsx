import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import MyLogo from '@/src/layouts/Logo'
import './index.less'

interface SiderProps {
  collapsed: boolean
}

const prefixCls = 'my-sider'

const SiderComponent: React.FC<SiderProps> = ({ collapsed }) => {
  return (
    <Layout.Sider
      className={`${prefixCls}`}
      theme='light'
      trigger={null}
      collapsible
      collapsed={collapsed}
      collapsedWidth={64}
      width={180}
    >
      <MyLogo collapsed={collapsed} />
    </Layout.Sider>
  )
}

SiderComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired
}

export default SiderComponent
