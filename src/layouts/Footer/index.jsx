import React from 'react'
import { CopyrightOutlined } from '@ant-design/icons'
import setting from '@/src/config'

import './index.less'

const { title, version } = setting

const FooterComponent = () => {
  return (
    <footer className='copyright'>
      Copyright
      <CopyrightOutlined />
      {title} {new Date().getFullYear()}
      <div className='version'>{version}</div>
    </footer>
  )
}

export default FooterComponent
