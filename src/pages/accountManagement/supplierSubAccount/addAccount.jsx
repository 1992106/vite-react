import React, { useState } from 'react'
import Modal from '@/components/Modal'
import { Form, Input, InputNumber } from 'antd'
import { createAccount } from '@/services/accountManagement'

const AddAccount = (props) => {
  const [form] = Form.useForm()
  const [isDisabled, setIsDisabled] = useState(false)

  const handleOk = () => {
    form
      .validateFields()
      .then(async (values) => {
        setIsDisabled(true)
        const res = await createAccount(values)
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
      title='新增账号'
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
          label='人员名称'
          name='userName'
          rules={[
            {
              required: true,
              message: '请输入人员名称'
            }
          ]}>
          <Input />
        </Form.Item>
        <Form.Item
          label='手机号码'
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
          ]}
          extra='手机号码用于管理企业微信功能'>
          <InputNumber />
        </Form.Item>
        <Form.Item
          label='初始密码'
          name='password'
          rules={[
            {
              required: true,
              min: 8,
              max: 16,
              message: '请输入8-16位密码'
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

export default AddAccount
