import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { Form, Input, Button } from 'antd'
import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { useDispatch, useSelector } from 'react-redux'
import { unwrapResult } from '@reduxjs/toolkit'
import classNames from 'classnames'
import CryptoJS from 'crypto-js'
import { fetchLogin, fetchWXLogin, selectUser } from '@/store/user'
import { getWxCpQrLoginCodeUrl } from '@/services/user'
import { formatSearchParams } from '@/src/utils'
import logo from '@/src/assets/images/logo.png'
import './Login.less'

const Login = () => {
  const history = useHistory()
  const { search } = useLocation()
  const dispatch = useDispatch()
  const { loading } = useSelector(selectUser)
  const [active, setActive] = useState(1)
  const [loginUrl, setLoginUrl] = useState('')

  const tabToggle = (key: number) => {
    setActive(key)
  }

  const tabClassName = (key: number) => {
    return classNames({ active: key === active })
  }

  // 获取企业微信二维码
  useEffect(() => {
    ;(async () => {
      const res = await getWxCpQrLoginCodeUrl()
      if (res) {
        setLoginUrl((res as any)?.data)
      }
    })()
  }, [])

  // 企业微信扫码登录
  useEffect(() => {
    ;(async () => {
      const { code } = formatSearchParams(search) as any
      if (code) {
        // 设置为企业微信登录
        tabToggle(2)
        // @ts-ignore
        const res = await dispatch(fetchWXLogin({ code }))
        const { token } = unwrapResult(res as any)
        if (token) {
          history.push('/')
        }
      }
    })()
  }, [search])

  const handleSubmit = async (values: any) => {
    const { loginAccount, password } = values
    const srcs = CryptoJS.enc.Utf8.parse(password)
    const key = CryptoJS.enc.Utf8.parse(loginAccount.padStart(16, '0'))
    const encrypted = CryptoJS.AES.encrypt(srcs, key, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    // @ts-ignore
    const res = await dispatch(fetchLogin({ loginAccount, password: encrypted.toString() }))
    const { token } = unwrapResult(res as any)
    if (token) {
      history.push('/')
    }
  }

  return (
    <div className='login-layout'>
      <div className='login-left'>
        <div className='login-welcome'>
          <div className='welcome'>
            <img className='logo' src={logo} alt='logo' />
            <h1>您好！</h1>
            <h2>欢迎来到供应商协同门户</h2>
          </div>
        </div>
      </div>
      <div className='login-right'>
        <header className='login-header'>
          <h1>
            <strong>登录</strong>
          </h1>
          <div className='tabs'>
            <Button
              type='link'
              size='large'
              className={tabClassName(1)}
              onClick={() => tabToggle(1)}>
              账号密码登录
            </Button>
            <Button
              type='link'
              size='large'
              className={tabClassName(2)}
              onClick={() => tabToggle(2)}>
              企业微信登录
            </Button>
          </div>
        </header>
        <div className='login-main'>
          {active === 1 && (
            <Form
              name='login'
              size='large'
              className='login-form'
              onFinish={handleSubmit}
              autoComplete='off'>
              <Form.Item
                name='loginAccount'
                rules={[
                  {
                    required: true,
                    max: 16,
                    message: '请输入账号'
                  },
                  {
                    pattern: /^[A-Za-z0-9/-]+$/, // 大小写字母+数组+中横线
                    message: '账号格式有误'
                  }
                ]}>
                <Input
                  prefix={<UserOutlined className='site-form-item-icon' />}
                  placeholder='账号'
                />
              </Form.Item>
              <Form.Item
                name='password'
                rules={[
                  {
                    required: true,
                    min: 8,
                    max: 16,
                    message: '请输入8-16位密码'
                  },
                  {
                    pattern: /^[A-Za-z0-9]+$/, // 大小写字母+数字
                    message: '密码格式有误'
                  }
                ]}
                extra='填写大小字母+数字（字符限制8-16位）'>
                <Input.Password
                  prefix={<LockOutlined className='site-form-item-icon' />}
                  type='password'
                  placeholder='密码'
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type='primary'
                  loading={loading === 'pending'}
                  htmlType='submit'
                  className='login-button'
                  style={{ width: '100%' }}>
                  登录
                </Button>
              </Form.Item>
            </Form>
          )}
          {active === 2 && <iframe src={loginUrl} className='login-iframe' />}
        </div>
      </div>
    </div>
  )
}

export default Login
