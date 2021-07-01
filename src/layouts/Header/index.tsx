import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'antd'
import MyIcon from '@/components/IconFont'

interface HeaderProps {
  collapsed: boolean
  onToggle: () => void
}

const HeaderComponent: React.FC<HeaderProps> = ({ collapsed, onToggle }) => {
  return (
    <Layout.Header>
      <div className='menuFold trigger' onClick={onToggle}>
        <MyIcon type={collapsed ? 'icon-menu-fold' : 'icon-menu-unfold '} />
      </div>
    </Layout.Header>
  )
}

HeaderComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired
}

export default HeaderComponent
