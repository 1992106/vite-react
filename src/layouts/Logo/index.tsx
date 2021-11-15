import React from 'react'
import PropTypes from 'prop-types'
import logo from '@/src/assets/images/logo.png'
import favicon from '@/src/favicon.ico'
import './index.less'

interface LogoProps {
  collapsed: boolean
}

const LogoComponent: React.FC<LogoProps> = ({ collapsed }) => {
  return (
    <div className='my-logo'>
      {collapsed ? <img src={favicon} alt='logo' /> : <img src={logo} alt='logo' />}
    </div>
  )
}

LogoComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired
}
export default LogoComponent
