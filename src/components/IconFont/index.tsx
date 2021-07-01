import React from 'react'
import PropTypes from 'prop-types'
import { createFromIconfontCN } from '@ant-design/icons'
import setting from '@/src/config'
import './index.less'

interface IconProps {
  type: string
  className?: string
  size?: string | number
  spin?: boolean
  style?: object
  rotate?: number
  color?: string
}

const prefixCls = 'my-icon'

const IconFont = createFromIconfontCN({ scriptUrl: setting.iconfont_url })

const MyIcon: React.FC<IconProps> = ({
  type = '',
  className = '',
  size = 18,
  spin,
  style = {},
  rotate,
  color = '#333'
}) => {
  size = typeof size === 'number' ? `${size}px` : size
  const newStyle = { color, fontSize: size, transform: '', ...style }
  rotate && (newStyle.transform = `${newStyle.transform} rotate(${rotate}deg)`)
  return (
    <IconFont
      type={type}
      className={`${prefixCls} ${className} ${spin && 'anticon-spin'}`}
      style={{ ...newStyle }}
    />
  )
}

MyIcon.propTypes = {
  type: PropTypes.string.isRequired,
  className: PropTypes.string,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  spin: PropTypes.bool,
  style: PropTypes.object,
  rotate: PropTypes.number,
  color: PropTypes.string
}

export default MyIcon
