import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Button, Modal, Popconfirm, Space, Table } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import {
  deleteAccount,
  disableAccount,
  enableAccount,
  selectAccountPage
} from '@/services/accountManagement'
import { isEmpty } from '@/src/utils'
import AddAccount from './addAccount'
import ModifyPassword from './modifyPassword'
import ModifyPhone from './modifyPhone'
import './index.less'

const initState = {
  data: [],
  total: 0,
  current: 1,
  pageSize: 20,
  loading: false,
  rowData: {},
  selectedRowKeys: []
}

const SupplierSubAccount = () => {
  const [state, setState] = useState(initState)

  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: state.selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setState((val) => {
        return { ...val, selectedRowKeys }
      })
    }
  }

  const selectRow = (record) => {
    const selectedRowKeys = [...state.selectedRowKeys]
    if (selectedRowKeys.indexOf(record.id) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
    } else {
      selectedRowKeys.push(record.id)
    }
    setState((val) => {
      return { ...val, selectedRowKeys }
    })
  }

  const columns = [
    {
      title: '账号登录名',
      dataIndex: 'loginName'
    },
    {
      title: '人员名称',
      dataIndex: 'userName'
    },
    {
      title: '类型',
      dataIndex: 'accountTypeDesc'
    },
    {
      title: '手机号码',
      dataIndex: 'phone'
    },
    {
      title: '创建日期',
      dataIndex: 'createdTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (record) => (
        <>
          {record?.accountType === 'CHILD' && (
            <Space>
              {record.phone ? (
                <Popconfirm
                  title='是否启用'
                  onConfirm={(event) => handleEnable(event, record)}
                  onCancel={(event) => event?.stopPropagation()}
                  disabled={!record.status}
                  okText='是'
                  cancelText='否'>
                  <Button
                    type='link'
                    disabled={!record.status}
                    onClick={(event) => event?.stopPropagation()}>
                    启用
                  </Button>
                </Popconfirm>
              ) : (
                <Button
                  type='link'
                  disabled={!record.status}
                  onClick={(event) => openModifyPhone(event, record, 'enable')}>
                  启用
                </Button>
              )}
              <Popconfirm
                title='是否禁用'
                onConfirm={(event) => handleDisable(event, record)}
                onCancel={(event) => event?.stopPropagation()}
                disabled={!!record.status}
                okText='是'
                cancelText='否'>
                <Button
                  type='link'
                  disabled={!!record.status}
                  onClick={(event) => event?.stopPropagation()}>
                  禁用
                </Button>
              </Popconfirm>
              <Button type='link' onClick={(event) => openModifyPassword(event, record)}>
                修改密码
              </Button>
              <Button type='link' onClick={(event) => openModifyPhone(event, record)}>
                修改手机
              </Button>
            </Space>
          )}
        </>
      )
    }
  ]

  const handleSearch = useCallback(async () => {
    const { current, pageSize } = state
    setState((val) => {
      return { ...val, loading: true }
    })
    const res = await selectAccountPage({ page: current, pageSize })
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

  // 新增账号
  const [isAdd, setIsAdd] = useState(false)
  const openAddAccount = () => {
    setIsAdd(true)
  }
  const closeAddAccount = useCallback((visible = false) => {
    setIsAdd(visible)
  }, [])

  // 是否可以删除（主账号不能删除）
  const isDisabledDelete = useMemo(() => {
    const rows = state.data.filter((item) => state.selectedRowKeys.includes(item.id))
    return !isEmpty(rows) && rows.every((val) => val?.accountType === 'CHILD')
  }, [state.selectedRowKeys])
  // 删除账号
  const [deleteLoading, setDeleteLoading] = useState(false)
  const handleDeleteAccount = () => {
    Modal.confirm({
      title: '删除',
      icon: <ExclamationCircleOutlined />,
      content: '确认删除账号？',
      onOk: async () => {
        setDeleteLoading(true)
        const res = await deleteAccount({
          idList: state.selectedRowKeys
        })
        setDeleteLoading(false)
        if (res?.status === 200) {
          await handleSearch()
        } else {
          throw new Error()
        }
      },
      okButtonProps: {
        danger: true,
        disabled: deleteLoading
      },
      okText: '删除'
    })
  }

  // 修改密码
  const [isModify, setIsModify] = useState(false)
  const openModifyPassword = async (event, record) => {
    event?.stopPropagation()
    setState((val) => {
      return { ...val, rowData: record }
    })
    setIsModify(true)
  }
  const closeModifyPassword = useCallback((visible = false) => {
    setIsModify(visible)
  }, [])

  // 修改手机
  const [isModifyPhone, setIsModifyPhone] = useState(false)
  const [keyword, setKeyword] = useState('')
  const openModifyPhone = async (event, record, key) => {
    event?.stopPropagation()
    setState((val) => {
      return { ...val, rowData: record }
    })
    setKeyword(key)
    setIsModifyPhone(true)
  }
  const closeModifyPhone = useCallback((visible = false) => {
    setIsModifyPhone(visible)
  }, [])

  // 启用
  const handleEnable = async (event, record) => {
    event?.stopPropagation()
    await enableAccount({ id: record?.id })
    await handleSearch()
  }

  // 禁用
  const handleDisable = async (event, record) => {
    event?.stopPropagation()
    await disableAccount({ list: [record?.id] })
    await handleSearch()
  }

  return (
    <div className={classnames('supplier-sub-account', 'page-content')}>
      <div className='table-toolbar'>
        <Space>
          <Button type='primary' onClick={openAddAccount}>
            新增
          </Button>
          <Button danger disabled={!isDisabledDelete} onClick={handleDeleteAccount}>
            删除
          </Button>
        </Space>
      </div>
      <Table
        size='middle'
        rowKey={(record) => record.id}
        rowSelection={rowSelection}
        loading={state.loading}
        columns={columns}
        dataSource={state.data}
        pagination={{
          pageSize: state.pageSize,
          current: state.current,
          total: state.total
        }}
        onRow={(record) => ({
          onClick: () => {
            selectRow(record)
          }
        })}
        onChange={handleChange}
      />
      {isAdd && <AddAccount visible={isAdd} onVisible={closeAddAccount} done={handleSearch} />}
      {isModify && (
        <ModifyPassword
          visible={isModify}
          onVisible={closeModifyPassword}
          rowData={state.rowData}
          done={handleSearch}
        />
      )}
      {isModifyPhone && (
        <ModifyPhone
          visible={isModifyPhone}
          onVisible={closeModifyPhone}
          rowData={state.rowData}
          keyword={keyword}
          done={handleSearch}
        />
      )}
    </div>
  )
}

export default SupplierSubAccount
