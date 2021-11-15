import React, { useContext, useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import { DatePicker, Form, Table } from 'antd'
import moment from 'moment'
import { batchAcceptOrder } from '@/services/orderManagement'
import { dateFormat } from '@/src/utils'

const EditableContext = React.createContext(null)

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  onUpdateRow,
  onUpdateForm,
  ...restProps
}) => {
  const form = useContext(EditableContext)

  useEffect(() => {
    if (editable) {
      onUpdateForm({ [record.id]: form })
      // 初始化赋值
      form.setFieldsValue({
        [dataIndex]: record[dataIndex]
      })
    }
  }, [])

  const handleEdit = async () => {
    const values = await form.validateFields()
    form.setFieldsValue({
      [dataIndex]: values[dataIndex]
    })
    onUpdateRow({ ...record, ...values })
  }

  let childNode = children

  const disabledDate = (current) => {
    return current && current < moment().subtract(1, 'days')
  }

  if (editable) {
    childNode = (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title}为必填项`
          },
          {
            validator: async (_, value) => {
              return value &&
                new Date(value.format('YYYY-MM-DD HH:mm')).getTime() >
                  new Date(dateFormat(new Date(), 'yyyy-MM-dd HH:mm')).getTime()
                ? Promise.resolve()
                : Promise.reject()
            },
            message: '不能小于当前时间'
          }
        ]}>
        <DatePicker
          allowClear
          format='YYYY-MM-DD HH:mm'
          disabledDate={disabledDate}
          showTime
          onChange={handleEdit}
        />
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const tableColumns = [
  {
    title: '采购单号',
    dataIndex: 'salesOrderNo'
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
    title: '二次工艺',
    dataIndex: 'secTypeDesc'
  },
  {
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '采购数量',
    dataIndex: 'orderNum'
  },
  {
    title: '预计交期',
    width: 200,
    dataIndex: 'estimatedDeliveryTime',
    editable: true
  }
]

const BatchAcceptOrder = (props) => {
  const [dataSource, setDataSource] = useState(() => {
    return props.rowsData.map((val) => {
      // 默认下单时间+48小时
      let defaultDate = null
      if (val?.confirmTime) {
        // 把时间截至到秒
        const confirmTime = dateFormat(val?.confirmTime, 'yyyy-MM-dd HH:mm')
        defaultDate = moment(
          new Date(new Date(confirmTime).getTime() + 2 * 24 * 60 * 60 * 1000),
          'YYYY-MM-DD HH:mm'
        )
      }
      return {
        ...val,
        estimatedDeliveryTime: defaultDate
      }
    })
  })
  const [isDisabled, setIsDisabled] = useState(false)

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell
    }
  }

  // 编辑时保存单元格form实例
  const [forms, setForms] = useState({})
  const handleUpdateForm = (form) => {
    setForms((val) => ({ ...val, ...form }))
  }

  // 更新表格数据
  const handleUpdateRow = (row) => {
    const newData = [...dataSource]
    const index = newData.findIndex((item) => row.id === item.id)
    const item = newData[index]
    newData.splice(index, 1, { ...item, ...row })
    setDataSource(newData)
  }

  const columns = tableColumns.map((col) => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        onUpdateRow: handleUpdateRow,
        onUpdateForm: handleUpdateForm
      })
    }
  })

  const handleOk = async () => {
    try {
      await Promise.all(Object.values(forms).map((form) => form.validateFields()))
      setIsDisabled(true)
      const params = dataSource.map((val) => ({
        id: val?.id,
        estimatedDeliveryTime: val?.estimatedDeliveryTime?.format('YYYY-MM-DD HH:mm')
      }))
      const res = await batchAcceptOrder(params)
      setIsDisabled(false)
      if (res?.status === 200) {
        props.onVisible?.()
        props.done?.()
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleCancel = () => {
    props.onVisible?.()
  }

  return (
    <Modal
      visible={props?.visible}
      title='接单'
      width={1200}
      onOk={handleOk}
      okButtonProps={{ disabled: isDisabled }}
      onCancel={handleCancel}>
      <Table
        bordered
        size='small'
        rowKey='id'
        components={components}
        rowClassName={() => 'editable-row'}
        columns={columns}
        dataSource={dataSource}
        pagination={false}
      />
    </Modal>
  )
}

export default BatchAcceptOrder
