import { useEffect, useState } from 'react'

export const useScroll = ({ selectedRowKeys } = {}) => {
  const [scroll, setScroll] = useState(null)
  const [collapsed, setCollapsed] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setScroll(getTableScroll())
    })
  }, [collapsed, selectedRowKeys])

  const handleCollapse = (collapsed) => {
    setCollapsed(collapsed)
  }

  return {
    scroll,
    collapsed,
    onCollapse: handleCollapse
  }
}

export const getTableScroll = ({ id, extraHeight } = {}) => {
  let tHeader
  if (id) {
    tHeader = document.getElementById(id)
      ? document.getElementById(id).querySelector('.ant-pro-table .ant-table-thead')
      : null
  } else {
    tHeader = document.querySelector('.ant-pro-table .ant-table-thead')
  }
  if (typeof extraHeight === 'undefined') {
    extraHeight = 56 + 24 // 底部分页height56 + 下边距padding24
  }
  // 表格内容距离顶部的距离
  let tHeaderBottom = 0
  if (tHeader) {
    tHeaderBottom = tHeader.getBoundingClientRect().bottom
  }
  const y = `calc(100vh - ${tHeaderBottom + extraHeight}px)`
  return { x: 'max-content', y }
}
