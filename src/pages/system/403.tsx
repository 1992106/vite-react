import React from 'react'
import { useHistory } from 'react-router-dom'
import { Result, Button } from 'antd'

const Forbidden = () => {
  const { push } = useHistory()

  const gotoHome = () => {
    push('/')
  }

  return (
    <Result
      status='403'
      title='403'
      subTitle='Sorry, you are not authorized to access this page.'
      extra={
        <Button type='primary' onClick={gotoHome}>
          返回首页
        </Button>
      }
    />
  )
}

export default Forbidden
