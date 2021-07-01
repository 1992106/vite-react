import React from 'react'
import { Dropdown, Menu, Spin, Modal } from 'antd'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { selectUser } from '@/store/user'
import Image from '@/components/Image'
import setting from '@/src/config'
import './index.less'

const AvatarComponent = () => {
  const user = useSelector(selectUser)

  const logout = () => {
    Modal.confirm({
      title: `温馨提示`,
      icon: <ExclamationCircleOutlined />,
      content: `您确定要退出${setting.title}吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        console.log('OK')
      }
    })
  }

  const menu = (
    <Menu>
      <Menu.Item>
        <div onClick={logout}>退出登录</div>
      </Menu.Item>
    </Menu>
  )

  if (user) {
    return (
      <Dropdown overlay={menu}>
        <div className='headerUserInfo'>
          <Image width={28} height={28} src={user?.avatar?.url} shape='circle' />
          <span className='username'> {user?.name} </span>
          <DownOutlined />
        </div>
      </Dropdown>
    )
  }
  return <Spin spinning />
}

export default AvatarComponent
