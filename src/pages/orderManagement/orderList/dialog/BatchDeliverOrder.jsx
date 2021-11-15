import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import Modal from '@/components/Modal'
import {
  Button,
  Col,
  Descriptions,
  Divider,
  Form,
  Input,
  message,
  Row,
  Select,
  Space,
  Table
} from 'antd'
import { invoiceOrder, printInvoiceTag } from '@/services/orderManagement'
import { fetchEnum } from '@/store/dict'
import Print from '@/components/Print'
import PrintTag from '../components/PrintTag'

const BatchDeliverOrder = (props) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [dataSource, setDataSource] = useState(props.expandedRowsData)
  const [isDisabled, setIsDisabled] = useState(false)
  const [logisticsOptions, setLogisticsOptions] = useState([])

  useEffect(() => {
    dispatch(fetchEnum({ enumCode: 'TRANSPORT' })).then((res) => {
      const options = (unwrapResult(res) || []).filter((val) => !val.disabled)
      setLogisticsOptions(options)
    })
  }, [])

  const columns = [
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
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Button type='link' danger onClick={() => handleDelete(record)}>
          删除
        </Button>
      )
    }
  ]

  const handleDelete = (record) => {
    const data = dataSource.filter((val) => val?.id !== record?.id)
    setDataSource(data)
  }

  // 获取打印标签
  const [tagsData, setTagsData] = useState([])
  const getPrintTagsData = async () => {
    const distributionIds = dataSource.map((val) => val?.id)
    const res = await printInvoiceTag(distributionIds)
    if (res?.data) {
      setTagsData(res?.data || [])
    }
  }

  const handleOk = (printf) => {
    form
      .validateFields()
      .then(async (values) => {
        if (dataSource.length === 0) {
          return message.warning('物料不能为空')
        }
        setIsDisabled(true)
        const { factoryId, factoryName, factoryContact, factoryPhone, factoryAddress } =
          props.rowData
        const res = await invoiceOrder({
          distributionIdList: dataSource.map((val) => ({ id: val?.id, version: val?.version })),
          factoryId,
          factoryName,
          factoryContact,
          factoryPhone,
          factoryAddress,
          ...values
        })
        setIsDisabled(false)
        if (res?.status === 200) {
          // 获取打印标签数据
          await getPrintTagsData()
          setTimeout(() => {
            // 打印标签
            printf()
            props.onVisible?.()
            props.done?.()
          }, 200)
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const handleCancel = () => {
    form.resetFields()
    props.onVisible?.()
  }

  return (
    <Modal
      visible={props?.visible}
      title='发货'
      width={1200}
      onCancel={handleCancel}
      footer={
        <Space>
          <Button onClick={handleCancel}>取消</Button>
          <Print
            buttonRender={({ onPrintf }) => (
              <Button type='primary' disabled={isDisabled} onClick={() => handleOk(onPrintf)}>
                确定并打印
              </Button>
            )}>
            <PrintTag tagsData={tagsData} />
          </Print>
        </Space>
      }>
      <Form form={form} autoComplete='off'>
        <Descriptions>
          <Descriptions.Item label='加工厂'>{props.rowData?.factoryName}</Descriptions.Item>
          <Descriptions.Item label='联系人'>{props.rowData?.factoryContact}</Descriptions.Item>
          <Descriptions.Item label='联系电话'>{props.rowData?.factoryPhone}</Descriptions.Item>
          <Descriptions.Item label='收货地址' span={2}>
            {props.rowData?.factoryAddress}
          </Descriptions.Item>
        </Descriptions>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item
              label='物流方式'
              name='logistics'
              rules={[
                {
                  required: true,
                  message: '请选择物流方式'
                }
              ]}
              style={{ marginBottom: '0px' }}>
              <Select options={logisticsOptions} />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='物流单号'
              name='logisticsOrder'
              rules={[
                {
                  max: 50,
                  message: '物流单号不能大于50字符'
                }
              ]}
              style={{ marginBottom: '0px' }}>
              <Input />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label='物流公司'
              name='logisticsCompany'
              rules={[
                {
                  max: 20,
                  message: '物流公司不能大于20字符'
                }
              ]}
              style={{ marginBottom: '0px' }}>
              <Input />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Divider />
      <Table
        bordered
        rowKey='id'
        size='small'
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </Modal>
  )
}

export default BatchDeliverOrder
