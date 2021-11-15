import React, { useState } from 'react'
import Modal from '@/components/Modal'
import { Form, Input, Select } from 'antd'
import { reportAbnormal } from '@/services/orderManagement'

const ReportAbnormal = (props) => {
  const [form] = Form.useForm()
  const [isDisabled, setIsDisabled] = useState(false)

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsDisabled(true)
        const res = await reportAbnormal({
          id: props.rowData?.id,
          ...values
        })
        setIsDisabled(false)
        if (res?.status === 200) {
          props.onVisible?.()
          props.done?.()
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
      title='报缺'
      width={520}
      onOk={handleOk}
      okButtonProps={{ disabled: isDisabled }}
      onCancel={handleCancel}>
      <Form
        form={form}
        labelCol={{
          span: 8
        }}
        wrapperCol={{
          span: 10
        }}
        autoComplete='off'>
        <Form.Item
          label='异常类型'
          name='type'
          rules={[
            {
              required: true,
              message: '请选择异常类型'
            }
          ]}>
          <Select options={[{ value: 1, label: '无货取消' }]} />
        </Form.Item>
        <Form.Item label='备注' name='remark'>
          <Input.TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ReportAbnormal
