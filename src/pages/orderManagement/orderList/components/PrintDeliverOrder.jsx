import React from 'react'
import QRCode from '@/components/QRcode'
import { Descriptions, Space, Table } from 'antd'
import logo from '@/src/assets/images/logo.png'
import './index.less'

const columns = [
  {
    title: '序号',
    dataIndex: 'index'
  },
  {
    title: '供应商物料编号',
    dataIndex: 'supplierMaterialCode',
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
    title: '色号',
    dataIndex: 'supplierMaterialColorNo'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '数量',
    dataIndex: 'distributionNum'
  },
  {
    title: '条数',
    dataIndex: 'distributionItemNum'
  },
  {
    title: '生产订单',
    dataIndex: 'produceOrderId',
    render: (text) => (
      <div>
        {text.map((val, i) => (
          <div key={i}>{val}</div>
        ))}
      </div>
    )
  }
]

const PrintDeliverOrder = ({ deliverOrderData }) => {
  return (
    <div className='print-deliver-order-wrap'>
      {deliverOrderData.map((orderData, index) => (
        <div key={index} style={{ position: 'relative', pageBreakAfter: 'always' }}>
          <Space align='center' style={{ marginBottom: '20px' }}>
            <QRCode text={orderData?.invoiceNo} width={80} height={80} />
            <h2>
              <strong>物流发货单</strong>
            </h2>
            <img src={logo} alt='logo' height='40px' />
          </Space>
          <Descriptions>
            <Descriptions.Item label='发货单' span={3}>
              {orderData?.invoiceNo}
            </Descriptions.Item>
            <Descriptions.Item label='收货方'>{orderData?.factoryName}</Descriptions.Item>
            <Descriptions.Item label='联系人'>{orderData?.factoryContact}</Descriptions.Item>
            <Descriptions.Item label='联系电话'>{orderData?.factoryPhone}</Descriptions.Item>
            <Descriptions.Item label='收货地址' span={3}>
              {orderData?.factoryAddress}
            </Descriptions.Item>
            <Descriptions.Item label='发货方'>{orderData?.supplierName}</Descriptions.Item>
            <Descriptions.Item label='制单人'>{orderData?.invoiceUser}</Descriptions.Item>
            <Descriptions.Item label='打印时间'>{orderData?.invoiceTime}</Descriptions.Item>
          </Descriptions>
          <div className='table-header'>
            <strong>发货清单</strong>
          </div>
          <Table
            rowKey='index'
            size='small'
            columns={columns}
            dataSource={orderData?.list || []}
            pagination={false}
          />
          <div className='table-footer'>
            合计: <strong>{orderData?.list.length || 0}</strong> 条
          </div>
        </div>
      ))}
    </div>
  )
}

export default PrintDeliverOrder
