import React, { useCallback, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import ProTable from '@ant-design/pro-table'
import { Button, Space, Tag } from 'antd'
import { fetchFactory } from '@/store/dict'
import { selectPage } from '@/services/orderManagement'
import { initState } from './hooks/config'
import { useScroll } from './hooks/useScroll'
import { useReportFlyOrder } from './dialog/ReportFlyOrder'
import ReportAbnormal from './dialog/ReportAbnormal'
import BatchAcceptOrder from './dialog/BatchAcceptOrder'
import { dateFormat, toEmpty } from '@/src/utils'

const ToAccept = () => {
  const dispatch = useDispatch()
  const actionRef = useRef(null)
  const [state, setState] = useState({
    ...initState,
    data: [],
    selectedRowKeys: [],
    rowData: {},
    rowsData: []
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
      title: '大货款号',
      dataIndex: 'goodsNo'
    },
    {
      title: '采购单号',
      dataIndex: 'salesOrderNo'
    },
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
      title: '供应商物料编号',
      dataIndex: 'supplierMaterialCode'
    },
    {
      title: '下单日期',
      dataIndex: 'confirmTime',
      valueType: 'dateRange'
    }
  ]
  const tableColumns = [
    {
      title: '物料图片',
      width: 100,
      fixed: 'left',
      dataIndex: 'imageUrl',
      valueType: 'image',
      fieldProps: { width: 50, height: 50 }
    },
    {
      title: '大货款号',
      width: 160,
      dataIndex: 'goodsNo',
      copyable: true
    },
    {
      title: '采购单号',
      width: 180,
      dataIndex: 'salesOrderNo',
      copyable: true,
      render: (text, record) => {
        return (
          <>
            {text}
            {record.overdue === 1 && <Tag color='error'>超期</Tag>}
          </>
        )
      }
    },
    {
      title: '加工厂',
      width: 120,
      dataIndex: 'factoryName'
    },
    {
      title: '物料编号',
      width: 160,
      dataIndex: 'materialSku',
      render: (_, record) => {
        return (
          <>
            <div>{record?.materialSku}</div>
            <div>{record?.materialName}</div>
          </>
        )
      }
    },
    {
      title: '供应商物料编号',
      width: 160,
      dataIndex: 'supplierMaterialCode',
      copyable: true,
      render: (text, record) => {
        return (
          <>
            <div>{text}</div>
            <div>{record?.supplierMaterialName}</div>
          </>
        )
      }
    },
    {
      title: '供应商物料色号',
      width: 160,
      dataIndex: 'supplierMaterialColorNo'
    },
    {
      title: '实际门幅(cm)/规格',
      width: 140,
      dataIndex: 'width'
    },
    {
      title: '克重(g/m2)',
      width: 100,
      dataIndex: 'weight'
    },
    {
      title: '二次工艺',
      width: 120,
      dataIndex: 'secTypeDesc'
    },
    {
      title: '单位',
      width: 80,
      dataIndex: 'unit'
    },
    {
      title: '采购数量',
      width: 80,
      dataIndex: 'orderNum'
    },
    {
      title: '订单单价(元)',
      width: 100,
      dataIndex: 'unitPrice'
    },
    {
      title: '订单金额',
      width: 80,
      dataIndex: 'orderAmount'
    },
    {
      title: '下单日期',
      width: 120,
      dataIndex: 'confirmTime',
      render: (text, record) => {
        return record.confirmTime ? dateFormat(record.confirmTime, 'yyyy-MM-dd HH:mm') : text
      }
    },
    {
      title: '期望交期',
      width: 120,
      dataIndex: 'expectDeliveryTime'
    },
    {
      title: '加工厂联系人',
      width: 120,
      dataIndex: 'factoryContact'
    },
    {
      title: '联系电话',
      width: 120,
      dataIndex: 'factoryPhone'
    },
    {
      title: '收货地址',
      width: 160,
      dataIndex: 'factoryAddress'
    },
    {
      title: '加工厂备注',
      width: 160,
      dataIndex: 'orderRemark'
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => [
        <a key='1' onClick={(event) => openBatchAcceptOrder(event, record)}>
          接单
        </a>,
        <a key='2' onClick={(event) => openReportAbnormal(event, record)}>
          报缺
        </a>
      ]
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

  // 勾选
  const rowSelection = {
    type: 'checkbox',
    selectedRowKeys: state.selectedRowKeys,
    onChange: (selectedRowKeys) => {
      setState((val) => ({ ...val, selectedRowKeys }))
    }
  }
  const selectRow = (record) => {
    const selectedRowKeys = [...state.selectedRowKeys]
    if (selectedRowKeys.indexOf(record.id) >= 0) {
      selectedRowKeys.splice(selectedRowKeys.indexOf(record.id), 1)
    } else {
      selectedRowKeys.push(record.id)
    }
    setState((val) => ({ ...val, selectedRowKeys }))
  }

  const handleSearch = async (params) => {
    const { current, pageSize, ...restParams } = params
    const res = await selectPage({
      ...toEmpty(restParams),
      showStatus: 2,
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

  // 报缺
  const [isAbnormal, setIsAbnormal] = useState(false)
  const openReportAbnormal = async (event, record) => {
    event?.stopPropagation()
    setState((val) => ({ ...val, rowData: record }))
    setIsAbnormal(true)
  }
  const closeReportAbnormal = useCallback(() => {
    setIsAbnormal(false)
  }, [])

  // 批量接单
  const [isBatchAcceptOrder, setIsBatchAcceptOrder] = useState(false)
  const openBatchAcceptOrder = async (event, record) => {
    event?.stopPropagation()
    const rowsData = record
      ? [record]
      : state.data.filter((val) => state.selectedRowKeys.includes(val?.id))
    setState((val) => ({ ...val, rowsData }))
    setIsBatchAcceptOrder(true)
  }
  const closeBatchAcceptOrder = useCallback(() => {
    setIsBatchAcceptOrder(false)
  }, [])

  // 飞单反馈
  const handleReportFlyOrder = useReportFlyOrder(state.selectedRowKeys, actionRef)

  const HeaderRender = (
    <Space>
      <Button
        type='primary'
        disabled={state.selectedRowKeys.length === 0}
        onClick={openBatchAcceptOrder}>
        批量接单
      </Button>
      <Button disabled={state.selectedRowKeys.length === 0} onClick={handleReportFlyOrder}>
        飞单反馈
      </Button>
    </Space>
  )

  return (
    <>
      <ProTable
        {...state.defaultConfig}
        actionRef={actionRef}
        scroll={scroll}
        request={handleSearch}
        columns={columns}
        pagination={state.pagination}
        search={{ ...state.search, collapsed, onCollapse }}
        options={state.options}
        headerTitle={HeaderRender}
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
      {isAbnormal && (
        <ReportAbnormal
          visible={isAbnormal}
          onVisible={closeReportAbnormal}
          done={actionRef.current?.reload}
          rowData={state.rowData}
        />
      )}
      {isBatchAcceptOrder && (
        <BatchAcceptOrder
          visible={isBatchAcceptOrder}
          onVisible={closeBatchAcceptOrder}
          done={actionRef.current?.reload}
          rowsData={state.rowsData}
        />
      )}
    </>
  )
}

export default ToAccept
