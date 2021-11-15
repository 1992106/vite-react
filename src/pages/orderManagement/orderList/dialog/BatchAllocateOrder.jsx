import React, { useContext, useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import { Form, Image, InputNumber, Table } from 'antd'
import { batchDistributeOrder } from '@/services/orderManagement'

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
      onUpdateForm({ [record.ids]: form })
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

  if (editable) {
    const precision = dataIndex === 'distributionNum' ? 2 : 0
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
          }
        ]}>
        <InputNumber min={1} precision={precision} onChange={handleEdit} />
      </Form.Item>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

const tableColumns = [
  {
    title: '物料图片',
    dataIndex: 'imageUrl',
    render: (text) => {
      return <Image src={text} width={50} height={50} />
    }
  },
  {
    title: '大货款号',
    dataIndex: 'goodsNos'
  },
  {
    title: '加工厂',
    dataIndex: 'factoryName'
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
    title: '单位',
    dataIndex: 'unit'
  },
  {
    title: '合计配货数',
    width: 140,
    dataIndex: 'distributionNum',
    editable: true
  },
  {
    title: '配货条数',
    width: 140,
    dataIndex: 'distributionItemNum',
    editable: true
  }
]

const BatchAcceptOrder = (props) => {
  const [dataSource, setDataSource] = useState(() => {
    // 加工厂+供应商物料编号+供应商物料色号
    const newData = props.rowsData.map((val) => {
      return val?.factoryId + val?.supplierMaterialCode + val?.supplierMaterialColorNo
    })
    const uniqueData = Array.from(new Set(newData))
    return uniqueData.map((val) => {
      const rows = props.rowsData.filter((item) => {
        return val === item?.factoryId + item?.supplierMaterialCode + item?.supplierMaterialColorNo
      })
      const distributionNum = rows.reduce((sum, row) => {
        return sum + (row?.orderNum || 0)
      }, 0)
      const row = rows[0] || {}
      return {
        ...row,
        distributionNum,
        distributionItemNum: null,
        ids: rows.map((v) => v?.id),
        goodsNos: rows.map((v) => v?.goodsNo).join(',')
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
    const index = newData.findIndex((item) => row.ids.toString() === item.ids.toString())
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
        salesOrderIdList: val?.ids,
        distributionNum: val?.distributionNum,
        distributionItemNum: val?.distributionItemNum
      }))
      const res = await batchDistributeOrder(params)
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
      title='配货'
      width={1200}
      onOk={handleOk}
      okButtonProps={{ disabled: isDisabled }}
      onCancel={handleCancel}>
      <Table
        bordered
        size='small'
        rowKey='ids'
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
