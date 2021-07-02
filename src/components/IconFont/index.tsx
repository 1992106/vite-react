import React from 'react'
import PropTypes from 'prop-types'
import { createFromIconfontCN } from '@ant-design/icons'
import setting from '@/src/config'
import './index.less'

interface IconProps {
  type: string
  size?: string | number
  color?: string
  spin?: boolean
  rotate?: number
  className?: string
  style?: object
  scriptUrl?: string
}

const prefixCls = 'my-icon'

let IconFont = createFromIconfontCN({ scriptUrl: setting.iconfont_url })

const MyIcon: React.FC<IconProps> = ({
  type,
  size = 14,
  color = 'unset',
  spin,
  rotate,
  className = '',
  style = {},
  scriptUrl
}) => {
  if (scriptUrl) {
    IconFont = createFromIconfontCN({ scriptUrl })
  }

  const fs = parseFloat(size + '')

  const wrapStyle = {
    color,
    fontSize: `${fs}px`,
    ...(rotate ? { transform: `rotate(${rotate}deg)` } : {}),
    ...style
  }

  return (
    <IconFont
      type={type}
      className={`${prefixCls} ${className} ${spin && 'anticon-spin'}`}
      style={wrapStyle}
    />
  )
}

MyIcon.propTypes = {
  type: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  color: PropTypes.string,
  spin: PropTypes.bool,
  rotate: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  scriptUrl: PropTypes.string
}

export default MyIcon
