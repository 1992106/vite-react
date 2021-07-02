import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import MyAvatar from '../Avatar'
import MyBreadcrumb from '../Breadcrumb'
import './index.less'

interface HeaderProps {
  collapsed: boolean
  onToggle: () => void
  routes?: any[]
}

const HeaderComponent: React.FC<HeaderProps> = ({ collapsed, onToggle, routes }) => {
  return (
    <Layout.Header className='app-header'>
      <div className='breadcrumb' onClick={onToggle}>
        <span className='collapsed'>
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </span>
        <MyBreadcrumb routes={routes} />
      </div>
      <MyAvatar />
    </Layout.Header>
  )
}

HeaderComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  routes: PropTypes.array
}

export default HeaderComponent
