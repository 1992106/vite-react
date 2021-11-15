import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import ProTable from '@ant-design/pro-table'
import { Button, Image, Space, Table } from 'antd'
import { useScroll } from './hooks/useScroll'
import { fetchFactory } from '@/store/dict'
import { selectInvoicePage } from '@/services/orderManagement'
import { initState } from './hooks/config'
import { useBatchCancelAllocateOrder } from './dialog/BatchCancelAllocateOrder'
import BatchDeliverOrder from './dialog/BatchDeliverOrder'
import { toEmpty } from '@/src/utils'

const expandedColumns = [
  {
    title: '物料图片',
    fixed: 'left',
    dataIndex: 'materialPic',
    render: (text) => {
      return <Image src={text} width={50} height={50} />
    }
  },
  {
    title: '物料编号',
    dataIndex: 'materialSku'
  },
  {
    title: '供应商物料编号',
    dataIndex: 'supplierMaterialCode'
  },
  {
    title: '供应商物料色号',
    dataIndex: 'supplierMaterialColorNo'
  },
  {
    title: '合计配货数',
    dataIndex: 'distributionNum'
  },
  {
    title: '配货条数',
    dataIndex: 'distributionItemNum'
  }
]

const expandedRowRender = (record, rowSelection, selectRow) => {
  return (
    <Table
      rowKey='id'
      size='middle'
      columns={expandedColumns}
      dataSource={record?.list || []}
      pagination={false}
      rowSelection={rowSelection}
      onRow={(record) => ({
        onClick: (event) => {
          const { nodeName, innerText } = event?.target || {}
          // 复制和预览图片时禁用
          if (nodeName === 'svg' || (nodeName === 'DIV' && innerText === '预览')) {
            return false
          }
          selectRow(record)
        }
      })}
    />
  )
}

const ToDeliver = () => {
  const dispatch = useDispatch()
  const actionRef = useRef(null)
  const [state, setState] = useState({
    ...initState,
    data: [],
    selectedRowKeys: [],
    rowData: {},
    expandedRowsData: [],
    expandedRowKeys: []
  })

  // 表格宽高
  const { scroll, collapsed, onCollapse } = useScroll({ selectedRowKeys: state.selectedRowKeys })

  // 获取加工厂
  const getFactoryOptions = async () => {
    const res = await dispatch(fetchFactory())
    return unwrapResult(res)
  }

  const searchColumns = [
    {
      title: '加工厂',
      dataIndex: 'factoryId',
      valueType: 'select',
      fieldProps: {
        showSearch: true
      },
      request: getFactoryOptions
    },
    {
      title: '配货日期',
      dataIndex: 'distributionTime',
      valueType: 'dateRange'
    }
  ]
  const tableColumns = [
    {
      title: '加工厂',
      dataIndex: 'factoryName'
    },
    {
      title: '待发货物料量',
      width: 160,
      dataIndex: 'waitInvoiceNum'
    },
    {
      title: '加工厂联系人',
      dataIndex: 'factoryContact'
    },
    {
      title: '联系电话',
      dataIndex: 'factoryPhone'
    },
    {
      title: '收货地址',
      dataIndex: 'factoryAddress'
    }
  ]
  const columns = [
    ...searchColumns.map((val) => {
      return {
        ...val,
        hideInTable: true
      }
    }),
    ...tableColumns.map((val) => {
      return {
        ...val,
        search: false,
        align: 'center'
      }
    })
  ]

  // 嵌套表格-勾选
  const rowSelection = useMemo(() => {
    return {
      type: 'checkbox',
      selectedRowKeys: state.selectedRowKeys,
      onChange: (selectedRowKeys) => {
        setState((val) => ({ ...val, selectedRowKeys }))
      }
    }
  }, [state.selectedRowKeys])
  const selectRow = useCallback(
    (record) => {
      const selectedRowKeys = [...state.selectedRowKeys]
      if (selectedRowKeys.indexOf(record.id) >= 0) {
        selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
      } else {
        selectedRowKeys.push(record.id)
      }
      setState((val) => ({ ...val, selectedRowKeys }))
    },
    [state.selectedRowKeys]
  )

  // 展开收起
  const expandable = {
    expandedRowRender: (record) => expandedRowRender(record, rowSelection, selectRow),
    expandedRowKeys: state.expandedRowKeys,
    onExpand: (expanded, record) => {
      const expandedRowKeys = expanded ? [record?.ids] : []
      const rowData = expanded ? record : {}
      setState((val) => ({ ...val, expandedRowKeys, rowData }))
      // 展开时且不是当前行时：清空勾选数据
      if (expanded && state.expandedRowKeys.length && record?.ids !== state.expandedRowKeys[0]) {
        setState((val) => ({ ...val, selectedRowKeys: [] }))
      }
    }
  }

  const handleSearch = async (params) => {
    const { current, pageSize, ...restParams } = params
    const res = await selectInvoicePage({
      ...toEmpty(restParams),
      page: current,
      pageSize: pageSize
    })
    if (res?.data) {
      // 备份表格数据, 更新分页
      setState((val) => ({
        ...val,
        data: res?.data?.list || [],
        pagination: { ...val.pagination, current, pageSize },
        selectedRowKeys: []
      }))
      const { total, list } = res.data
      return {
        success: true,
        data: list || [],
        total: total || 0
      }
    } else {
      return {
        success: false,
        data: [],
        total: 0
      }
    }
  }
  // 发货
  const [isBatchDeliverOrder, setIsBatchDeliverOrder] = useState(false)
  const openBatchDeliverOrder = async (event) => {
    event?.stopPropagation()
    const expandedRowsData = state.data.flatMap((data) => {
      return (data?.list || []).filter((val) => state.selectedRowKeys.includes(val?.id))
    })
    setState((val) => ({ ...val, expandedRowsData }))
    setIsBatchDeliverOrder(true)
  }
  const closeBatchDeliverOrder = useCallback(() => {
    setIsBatchDeliverOrder(false)
  }, [])
  // 取消配货
  const handleBatchCancelAllocateOrder = useBatchCancelAllocateOrder(
    state.selectedRowKeys,
    actionRef
  )

  const HeaderRender = (
    <Space>
      <Button
        type='primary'
        disabled={state.selectedRowKeys.length === 0}
        onClick={openBatchDeliverOrder}>
        发货
      </Button>
      <Button
        disabled={state.selectedRowKeys.length === 0}
        onClick={handleBatchCancelAllocateOrder}>
        取消配货
      </Button>
    </Space>
  )

  return (
    <>
      <ProTable
        {...state.defaultConfig}
        rowKey='ids'
        actionRef={actionRef}
        scroll={scroll}
        request={handleSearch}
        columns={columns}
        pagination={state.pagination}
        search={{ ...state.search, collapsed, onCollapse }}
        options={state.options}
        headerTitle={HeaderRender}
        expandable={expandable}
      />
      {isBatchDeliverOrder && (
        <BatchDeliverOrder
          visible={isBatchDeliverOrder}
          onVisible={closeBatchDeliverOrder}
          done={actionRef.current?.reload}
          rowData={state.rowData}
          expandedRowsData={state.expandedRowsData}
        />
      )}
    </>
  )
}

export default ToDeliver
