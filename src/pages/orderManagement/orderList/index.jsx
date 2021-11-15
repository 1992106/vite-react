import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { Badge, Layout, Menu } from 'antd'
import All from './All'
import Abnormal from './Abnormal'
import FlyOrder from './FlyOrder'
import ToOrder from './ToOrder'
import ToAccept from './ToAccept'
import ToAllocate from './ToAllocate'
import ToDeliver from './ToDeliver'
import ToReceive from './ToReceive'
import Completed from './Completed'
import Canceled from './Canceled'
import { getStatistics } from '@/services/orderManagement'
import './index.less'

const initStatus = [
  { label: '全部', value: 0, count: 0, component: All },
  { label: '异常', value: 40, count: 0, component: Abnormal },
  { label: '飞单', value: 50, count: 0, component: FlyOrder },
  { label: '待下单', value: 1, count: 0, component: ToOrder },
  { label: '待接单', value: 2, count: 0, component: ToAccept },
  { label: '待配货', value: 3, count: 0, component: ToAllocate },
  { label: '待发货', value: 4, count: 0, component: ToDeliver },
  { label: '待收货', value: 5, count: 0, component: ToReceive },
  { label: '已完成', value: 6, count: 0, component: Completed },
  { label: '已取消', value: 7, count: 0, component: Canceled }
]

const OrderList = () => {
  const history = useHistory()
  const [status, setStatus] = useState(initStatus)
  const [collapsed, setCollapsed] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState(() => {
    const {
      location: { search }
    } = history
    const key = search ? search.replace('?', '').split('=')[1] : '40'
    return [key]
  })

  // 获取统计
  const fetchStatistics = async () => {
    const res = await getStatistics()
    if (res?.status === 200) {
      const { data } = res
      const newStatus = status.map((v) => {
        const count = (data || []).find((i) => i.status === v?.value)?.statusNum || 0
        return {
          ...v,
          count
        }
      })
      setStatus(newStatus)
    }
  }

  useEffect(() => {
    fetchStatistics()
  }, [])

  // 展开收起
  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed)
  }

  // 点击菜单
  const handleClick = async ({ key }) => {
    history.replace(`/order/order-list?status=${key}`)
    setSelectedKeys([key])
    await fetchStatistics()
  }

  const Component = useMemo(() => {
    const key = selectedKeys.length ? selectedKeys[0] : null
    const node = status.find((val) => key && val.value === +key)
    return node ? node?.component : null
  }, [selectedKeys, status])

  return (
    <Layout className='order-list'>
      <Layout.Sider
        theme='light'
        collapsible
        collapsedWidth={0}
        zeroWidthTriggerStyle={{ top: '120px' }}
        collapsed={collapsed}
        onCollapse={handleCollapse}>
        <Menu selectedKeys={selectedKeys} onClick={handleClick}>
          {status.map((item) => (
            <Menu.Item key={item?.value}>
              <Badge count={item?.count}>
                <div style={{ paddingRight: '16px' }}>{item?.label}</div>
              </Badge>
            </Menu.Item>
          ))}
        </Menu>
      </Layout.Sider>
      <Layout.Content className='page-content'>{Component ? <Component /> : null}</Layout.Content>
    </Layout>
  )
}

export default OrderList
