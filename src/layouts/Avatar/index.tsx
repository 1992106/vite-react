import React from 'react'
import { useHistory } from 'react-router-dom'
import { Avatar, Button, Dropdown, Menu, Modal } from 'antd'
import { DownOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { logout, selectUser } from '@/store/user'
import setting from '@/src/config'
import { download } from '@/utils/file/download'
import userGuide from '@/src/assets/供应商协同门户操作手册(面辅料供应商版)V1.0.pdf'
import './index.less'

const { title } = setting

const AvatarComponent = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const { userInfo } = useSelector(selectUser)

  const handleLogout = ({ key }: { key: string }) => {
    if (key === 'logout') {
      Modal.confirm({
        title: `温馨提示`,
        icon: <ExclamationCircleOutlined />,
        content: `您确定要退出${title}吗？`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          await history.push('/login')
          dispatch(logout())
        }
      })
    }
  }

  const menu = (
    <Menu onClick={handleLogout}>
      <Menu.Item key='logout'>退出登录</Menu.Item>
    </Menu>
  )

  const handleUserGuide = () => {
    // const url = encodeURI(
    //   `${
    //     import.meta.env.VITE_API_BASE_URL
    //   }/assets/供应商协同门户操作手册(面辅料供应商版)V1.0.pdf?${Date.now()}`
    // )
    download(encodeURI(userGuide), '供应商协同门户操作手册(面辅料供应商版)V1.0.pdf')
  }

  return (
    <div className='my-avatar'>
      <Button type='link' onClick={handleUserGuide}>
        使用手册
      </Button>
      <Dropdown overlay={menu}>
        <div className='avatar-name'>
          <Avatar size={28} src={`https://api.multiavatar.com/${userInfo.userName}.png`} />
          <span className='name'> {userInfo?.userName} </span>
          <DownOutlined className='icon' />
        </div>
      </Dropdown>
    </div>
  )
}

export default AvatarComponent
