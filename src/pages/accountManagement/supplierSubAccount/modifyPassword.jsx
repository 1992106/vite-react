import React, { useState } from 'react'
import Modal from '@/components/Modal'
import { Form, Input } from 'antd'
import { changePassword } from '@/services/accountManagement'

const ModifyPassword = (props) => {
  const [form] = Form.useForm()
  const [isDisabled, setIsDisabled] = useState(false)

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsDisabled(true)
        const res = await changePassword({
          id: props.rowData?.id,
          ...values
        })
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
      title='修改密码'
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
          label='新密码'
          name='password'
          rules={[
            {
              required: true,
              min: 8,
              max: 16,
              message: '请输入8-16位字符密码'
            },
            {
              pattern: /^[A-Za-z0-9]+$/, // 大小写字母+数字+下划线
              message: '密码由大小写字母+数字组成'
            }
          ]}>
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ModifyPassword
