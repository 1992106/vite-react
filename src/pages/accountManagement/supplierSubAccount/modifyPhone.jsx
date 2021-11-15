import React, { useState } from 'react'
import Modal from '@/components/Modal'
import { Form, InputNumber } from 'antd'
import { changePhone, enableAccount } from '@/services/accountManagement'

const ModifyPhone = (props) => {
  const [form] = Form.useForm()
  const [isDisabled, setIsDisabled] = useState(false)

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsDisabled(true)
        let res
        if (props?.keyword === 'enable') {
          res = await enableAccount({
            id: props.rowData?.id,
            ...values
          })
        } else {
          res = await changePhone({
            id: props.rowData?.id,
            ...values
          })
        }
        setIsDisabled(false)
        if (res?.status === 200) {
          props?.onVisible()
          props?.done()
        }
      })
      .catch((errors) => {
        console.error(errors)
      })
  }

  const handleCancel = () => {
    form.resetFields()
    props?.onVisible()
  }

  return (
    <Modal
      visible={props?.visible}
      title='修改手机'
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
          label='新手机'
          name='phone'
          required
          rules={[
            {
              validator: async (_, value) => {
                return value != null && value.toString().length === 11
                  ? Promise.resolve()
                  : Promise.reject()
              },
              message: '请输入11位手机号码'
            }
          ]}>
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModifyPhone
