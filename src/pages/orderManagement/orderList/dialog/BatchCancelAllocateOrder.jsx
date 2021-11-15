import React, { useState } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { batchCancelDistributeOrder } from '@/services/orderManagement'

export const useBatchCancelAllocateOrder = (ids, actionRef) => {
  const [batchCancelAllocateOrderLoading, setBatchCancelAllocateOrderLoading] = useState(false)
  return () => {
    Modal.confirm({
      title: '取消配货',
      icon: <ExclamationCircleOutlined />,
      content: '确认取消配货？',
      onOk: async () => {
        setBatchCancelAllocateOrderLoading(true)
        const res = await batchCancelDistributeOrder(ids)
        setBatchCancelAllocateOrderLoading(false)
        if (res?.status === 200) {
          await actionRef.current.reload()
        } else {
          throw new Error()
        }
      },
      okButtonProps: {
        danger: true,
        disabled: batchCancelAllocateOrderLoading
      },
      okText: '确认'
    })
  }
}
