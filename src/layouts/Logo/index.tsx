import React from 'react'
import PropTypes from 'prop-types'

interface LogoProps {
  collapsed: boolean
}

const LogoComponent: React.FC<LogoProps> = ({ collapsed }) => {
  return (
    <div className='my-logo'>
      <img src='../../assets/logo.svg' alt='' />
      {!collapsed && <h2 className='title'>Mars-SCM</h2>}
    </div>
  )
}

LogoComponent.propTypes = {
  collapsed: PropTypes.bool.isRequired
}
export default LogoComponent
