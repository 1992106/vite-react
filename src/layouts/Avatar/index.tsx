import React from 'react'
import { Avatar, Dropdown, Menu, Modal } from 'antd'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { selectUser } from '@/store/user'
import setting from '@/src/config'
import './index.less'

const { title } = setting

const AvatarComponent = () => {
  const user = useSelector(selectUser)

  const logout = () => {
    Modal.confirm({
      title: `温馨提示`,
      icon: <ExclamationCircleOutlined />,
      content: `您确定要退出${title}吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        console.log('OK')
      }
    })
  }

  const menu = (
    <Menu onClick={logout}>
      <Menu.Item key='logout'>退出登录</Menu.Item>
    </Menu>
  )

  return (
    <Dropdown overlay={menu}>
      <div className='my-avatar'>
        <Avatar
          size={28}
          src='https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png?1621910757234'
        />
        <span className='name'> {user?.nickname} </span>
        <DownOutlined className='icon' />
      </div>
    </Dropdown>
  )
}

export default AvatarComponent
