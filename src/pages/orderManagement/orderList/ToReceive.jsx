import React, { useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import ProTable from '@ant-design/pro-table'
import { Button, Space } from 'antd'
import { useScroll } from './hooks/useScroll'
import { printInvoiceOrder, printInvoiceTag, selectPage } from '@/services/orderManagement'
import { initState } from './hooks/config'
import { useReportFlyOrder } from './dialog/ReportFlyOrder'
import { fetchFactory } from '@/store/dict'
import { toEmpty } from '@/src/utils'
import PrintTag from '@/pages/orderManagement/orderList/components/PrintTag'
import Print from '@/components/Print'
import PrintDeliverOrder from '@/pages/orderManagement/orderList/components/PrintDeliverOrder'

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
    copyable: true
  },
  {
    title: '发货单号',
    width: 160,
    dataIndex: 'invoiceNo'
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
    title: '物流方式',
    width: 80,
    dataIndex: 'logisticsDesc'
  },
  {
    title: '物流单号',
    width: 160,
    dataIndex: 'logisticsOrder'
  },
  {
    title: '物流公司',
    width: 160,
    dataIndex: 'logisticsCompany'
  },
  {
    title: '下单日期',
    width: 120,
    dataIndex: 'confirmTime'
  },
  {
    title: '期望交期',
    width: 120,
    dataIndex: 'expectDeliveryTime'
  },
  {
    title: '要求交期',
    width: 120,
    dataIndex: 'requiredDeliveryTime'
  },
  {
    title: '发货日期',
    width: 160,
    dataIndex: 'invoiceTime'
  }
]

const ToReceive = () => {
  const dispatch = useDispatch()
  const actionRef = useRef(null)
  const [state, setState] = useState({ ...initState, data: [], selectedRowKeys: [] })

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
      title: '发货日期',
      dataIndex: 'invoiceTime',
      valueType: 'dateRange'
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
      showStatus: 5,
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

  // 打印发货单
  const [deliverOrderData, setDeliverOrderData] = useState([])
  const handlePrintDeliverOrder = async (printf) => {
    const invoiceIds = state.data
      .filter((val) => state.selectedRowKeys.includes(val.id))
      .map((val) => val?.invoiceId)
    const uniqueInvoiceIds = Array.from(new Set(invoiceIds))
    const res = await printInvoiceOrder(uniqueInvoiceIds)
    if (res?.data) {
      setDeliverOrderData(res?.data || [])
      setTimeout(() => {
        printf()
      }, 200)
    }
  }

  // 打印标签
  const [tagsData, setTagsData] = useState([])
  const handlePrintTag = async (printf) => {
    const distributionIds = state.data
      .filter((val) => state.selectedRowKeys.includes(val.id))
      .map((val) => val?.distributionId)
    const uniqueDistributionIds = Array.from(new Set(distributionIds))
    const res = await printInvoiceTag(uniqueDistributionIds)
    if (res?.data) {
      setTagsData(res?.data || [])
      setTimeout(() => {
        printf()
      }, 200)
    }
  }

  // 飞单反馈
  const handleReportFlyOrder = useReportFlyOrder(state.selectedRowKeys, actionRef)

  const HeaderRender = (
    <Space>
      <Print
        buttonRender={({ onPrintf }) => (
          <Button
            disabled={state.selectedRowKeys.length === 0}
            onClick={() => handlePrintDeliverOrder(onPrintf)}>
            打印发货单
          </Button>
        )}>
        <PrintDeliverOrder deliverOrderData={deliverOrderData} />
      </Print>
      <Print
        buttonRender={({ onPrintf }) => (
          <Button
            disabled={state.selectedRowKeys.length === 0}
            onClick={() => handlePrintTag(onPrintf)}>
            打印标签
          </Button>
        )}>
        <PrintTag tagsData={tagsData} />
      </Print>
      <Button disabled={state.selectedRowKeys.length === 0} onClick={handleReportFlyOrder}>
        飞单反馈
      </Button>
    </Space>
  )

  return (
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
        onClick: () => {
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

export default ToReceive
