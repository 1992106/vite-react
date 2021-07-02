import React from 'react'
import PropTypes from 'prop-types'
import logo from '@/src/assets/logo.svg'
import './index.less'

interface LogoProps {
  collapsed: boolean
}

const LogoComponent: React.FC<LogoProps> = ({ collapsed }) => {
  return (
    <div className='my-logo'>
      <img src={logo} alt='logo' />
      {!collapsed && <h2 className='title'>Mars-SCM</h2>}
    </div>
  )
}

LogoComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired
}
export default LogoComponent
