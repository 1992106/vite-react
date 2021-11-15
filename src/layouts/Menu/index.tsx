import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { useLocation, Link } from 'react-router-dom'
import { Menu } from 'antd'
import MyIcon from '@/components/IconFont'
import './index.less'

interface MenuProps {
  collapsed: boolean
  routes?: any[]
}

const initMenus = (routes: any[] = [], parent = '') => {
  return routes.map((item) => {
    const path = parent + item.path
    return item.routes && item.routes.length > 0 ? (
      <Menu.SubMenu
        key={path}
        icon={item?.meta?.icon && <MyIcon type={item?.meta?.icon} size={20} />}
        title={item?.meta?.title}>
        {initMenus(item.routes, path)}
      </Menu.SubMenu>
    ) : !item?.meta?.hidden ? (
      <Menu.Item
        key={item.path}
        icon={item?.meta?.icon && <MyIcon type={item?.meta?.icon} size={20} />}>
        <Link to={item.path}>{item?.meta?.title}</Link>
      </Menu.Item>
    ) : null
  })
}

const MenuComponent: React.FC<MenuProps> = ({ collapsed, routes }) => {
  const { pathname } = useLocation()
  const [selectedKeys, setSelectedKeys] = useState([pathname])
  const [openKeys, setOpenKeys] = useState<any[]>([])

  const handleOpenKeys = (pathname: string, end?: undefined | number) => {
    let str = ''
    return pathname
      .split('/')
      .slice(1, end)
      .map((item) => {
        return (str += `/${item}`)
      })
  }

  // 初始化默认打开的菜单跟默认选中项
  useEffect(() => {
    const openKeys = handleOpenKeys(pathname, -1)
    setOpenKeys(openKeys)
    setSelectedKeys([pathname])
  }, [pathname, collapsed])

  // 点击菜单
  const onClick = ({ key }: { key: string }) => {
    setSelectedKeys([key])
  }

  // 展开/关闭子菜单
  const onOpenChange = (keys: any[]) => {
    const latestOpenKey = keys[keys.length - 1] || ''
    let newOpenKeys = handleOpenKeys(latestOpenKey)
    if (newOpenKeys.toString() === openKeys.toString()) {
      newOpenKeys = []
    }
    setOpenKeys(newOpenKeys)
  }

  return (
    <div className='my-menu'>
      <Menu
        mode='inline'
        style={{ border: 0 }}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onClick={onClick}
        onOpenChange={onOpenChange}>
        {initMenus(routes)}
      </Menu>
    </div>
  )
}

MenuComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  routes: PropTypes.array
}

export default MenuComponent
