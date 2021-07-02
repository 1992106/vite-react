import React from 'react'
import PropTypes from 'prop-types'
import { Menu } from 'antd'

interface MenuProps {
  collapsed: boolean
  routes?: any[]
}

const MenuComponent: React.FC<MenuProps> = ({ collapsed, routes }) => {
  return (
    <Menu>
      <Menu.Item />
    </Menu>
  )
}

MenuComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  routes: PropTypes.array
}
export default MenuComponent
