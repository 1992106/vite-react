import React, { ReactNode, useState } from 'react'
import Icon from '@/components/IconFont'
import { Image } from 'antd'
import './index.less'
import PropTypes from 'prop-types'

interface ImageProps {
  /** 图片路径 */
  src: string
  /** 是否预览 */
  preview?: boolean | PreviewType
  /** 缩放宽度 */
  width?: number
  /** 缩放高度 */
  height?: number
  /** 是否圆型 */
  shape?: 'circle' | 'square'
}

interface PreviewType {
  visible?: boolean
  onVisibleChange?: (visible: boolean, prevVisible: boolean) => void
  getContainer?: string | HTMLElement | (() => HTMLElement)
  src?: string
  mask?: ReactNode
  maskClassName?: string
  current?: number
}

const prefixCls = 'my-image'

const MyImage: React.FC<ImageProps> = ({ src, preview = false, ...props }) => {
  // 预览
  const [visible, setVisible] = useState(false)

  let resize = ''
  resize += props.width ? `,w_${props.width | 0}` : ''
  resize += props.height ? `,h_${props.height | 0}` : ''
  resize = resize ? `?x-oss-process=image/resize,limit_0${resize}` : ''

  let className: string = `${prefixCls} ${props?.shape === 'circle' ? 'circle' : ''}`

  const onVisible = (visible: boolean) => {
    setVisible(visible)
  }

  const previewType: boolean | PreviewType =
    typeof preview === 'boolean'
      ? {
          visible: visible,
          onVisibleChange: onVisible,
          src: src
        }
      : preview

  return (
    <Image
      {...props}
      preview={previewType}
      src={`${src}${resize}`}
      width={props.width}
      height={props.height}
      placeholder={<Icon type='icon-loading' spin size={20} color='#eee' />}
      className={className}
      // eslint-disable-next-line max-len
      fallback='data:image/png;base64,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'
    />
  )
}

MyImage.propTypes = {
  src: PropTypes.string.isRequired,
  preview: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
  width: PropTypes.number,
  height: PropTypes.number,
  shape: PropTypes.oneOf(['circle', 'square'])
}

export default MyImage