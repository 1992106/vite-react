import React from 'react'
import { CopyrightOutlined } from '@ant-design/icons'
import setting from '@/src/config'
import './index.less'

const { title } = setting
const version = '1.0.0'

const FooterComponent = () => {
  return (
    <footer className='app-footer'>
      <div className='copyright'>
        Copyright
        <CopyrightOutlined />
        {title} {new Date().getFullYear()}
        <span className='version'>{version}</span>
      </div>
    </footer>
  )
}

export default FooterComponent
