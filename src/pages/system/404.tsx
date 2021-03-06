import React from 'react'
import { useHistory } from 'react-router-dom'
import { Result, Button } from 'antd'

const NotFound = () => {
  const { push } = useHistory()

  const gotoHome = () => {
    push('/')
  }

  return (
    <Result
      status='404'
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button type='primary' onClick={gotoHome}>
          返回首页
        </Button>
      }
    />
  )
}

export default NotFound
