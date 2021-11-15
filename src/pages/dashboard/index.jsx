import React, { useCallback, useEffect, useState } from 'react'
import { Button, Table, Tag } from 'antd'
import classnames from 'classnames'
import { isEmpty } from '@/src/utils'
import { selectPage } from '@/services/dashboard'
import ViewNotice from './dialog/ViewNotice'
import './index.less'

const initState = {
  data: [],
  total: 0,
  current: 1,
  pageSize: 20,
  loading: false,
  rowData: {}
}

const Dashboard = () => {
  const [state, setState] = useState(initState)

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      render: (_, __, index) => <>{index + 1}</>
    },
    {
      title: '公告标题',
      dataIndex: 'noteTitle',
      render: (text, record) => (
        <>
          <Button type='link' onClick={() => openViewNotice(record)}>
            {text}
          </Button>
          {record?.isRead === 0 && <Tag color='#f00'>New</Tag>}
        </>
      )
    },
    {
      title: '创建时间',
      width: 200,
      dataIndex: 'createAt'
    }
  ]

  const handleSearch = useCallback(async () => {
    const { current, pageSize } = state
    setState((val) => {
      return { ...val, loading: true }
    })
    const res = await selectPage({ page: current, pageSize })
    if (res?.data) {
      const { total, list } = res.data
      setState((val) => {
        return { ...val, data: list, total, loading: false }
      })
    }
  }, [state.current, state.pageSize])

  useEffect(() => {
    handleSearch()
  }, [handleSearch])

  const handleChange = (pagination, filters, sorter) => {
    // 分页
    if (!isEmpty(pagination)) {
      const { current, pageSize } = pagination
      setState((val) => {
        return { ...val, current, pageSize }
      })
    }
    // 筛选
    if (!isEmpty(filters)) {
    }
    // 排序
    if (!isEmpty(sorter)) {
    }
  }

  // 查看公告
  const [isView, setIsView] = useState(false)
  const openViewNotice = async (record) => {
    // 把为读改成已读
    const list = state.data.map((val) => ({
      ...val,
      ...(record.noteId === val?.noteId ? { isRead: 1 } : {})
    }))
    setState((val) => {
      return { ...val, rowData: record, data: list }
    })
    setIsView(true)
  }
  const closeViewNotice = useCallback((visible = false) => {
    setIsView(visible)
  }, [])

  return (
    <div className={classnames('notice-wrap', 'page-content')}>
      <Table
        size='middle'
        rowKey={(record) => record?.noteId}
        loading={state.loading}
        columns={columns}
        dataSource={state.data}
        pagination={{
          pageSize: state.pageSize,
          current: state.current,
          total: state.total
        }}
        onChange={handleChange}
      />
      {isView && (
        <ViewNotice
          visible={isView}
          onVisible={closeViewNotice}
          rowData={state.rowData}
          done={handleSearch}
        />
      )}
    </div>
  )
}

export default Dashboard
