import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import ProTable from '@ant-design/pro-table'
import { useScroll } from './hooks/useScroll'
import { fetchFactory } from '@/store/dict'
import { selectPage } from '@/services/orderManagement'
import { initState } from './hooks/config'
import { toEmpty } from '@/src/utils'

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
    title: '订单单价(元)',
    width: 100,
    dataIndex: 'unitPrice'
  },
  {
    title: '单位',
    width: 80,
    dataIndex: 'unit'
  },
  {
    title: '加工厂',
    width: 120,
    dataIndex: 'factoryName'
  },
  {
    title: '加工厂备注',
    width: 160,
    dataIndex: 'orderRemark'
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
  },
  {
    title: '取消日期',
    width: 160,
    dataIndex: 'cancelTime'
  },
  {
    title: '取消原因',
    width: 200,
    dataIndex: 'cancelReason'
  }
]

const Canceled = () => {
  const dispatch = useDispatch()
  const [state, setState] = useState(initState)
  // 表格宽高
  const { scroll, collapsed, onCollapse } = useScroll()

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
      title: '供应商物料编号',
      dataIndex: 'supplierMaterialCode'
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
      title: '下单日期',
      dataIndex: 'confirmTime',
      valueType: 'dateRange'
    },
    {
      title: '取消日期',
      dataIndex: 'cancelTime',
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

  const handleSearch = async (params) => {
    const { current, pageSize, ...restParams } = params
    const res = await selectPage({
      ...toEmpty(restParams),
      showStatus: 7,
      page: current,
      pageSize: pageSize
    })
    if (res?.data) {
      // 更新分页
      setState((val) => {
        return { ...val, pagination: { ...val.pagination, current, pageSize } }
      })
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

  return (
    <ProTable
      {...state.defaultConfig}
      scroll={scroll}
      request={handleSearch}
      columns={columns}
      pagination={state.pagination}
      search={{ ...state.search, collapsed, onCollapse }}
      options={state.options}
    />
  )
}

export default Canceled
