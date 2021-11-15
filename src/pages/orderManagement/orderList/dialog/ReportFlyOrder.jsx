import React, { useState } from 'react'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { reportBrokenOrder } from '@/services/orderManagement'

export const useReportFlyOrder = (ids, actionRef) => {
  const [reportFlyOrderLoading, setReportFlyOrderLoading] = useState(false)
  return () => {
    Modal.confirm({
      title: '飞单反馈',
      icon: <ExclamationCircleOutlined />,
      content: '确认举报飞单？',
      onOk: async () => {
        setReportFlyOrderLoading(true)
        const res = await reportBrokenOrder({
          ids: ids
        })
        setReportFlyOrderLoading(false)
        if (res?.status === 200) {
          await actionRef.current.reload()
        } else {
          throw new Error()
        }
      },
      okButtonProps: {
        danger: true,
        disabled: reportFlyOrderLoading
      },
      okText: '举报'
    })
  }
}
