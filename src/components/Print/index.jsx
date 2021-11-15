import React, { useRef } from 'react'
import PropTypes from 'prop-types'
import QRCode from '@/components/QRcode'
import Barcode from '@/components/Barcode'
import print from '@/utils/print'
import './index.less'

const Print = ({ children, buttonRender, ...props }) => {
  const printRef = useRef(null)

  const handlePrintf = () => {
    print({
      el: printRef.current,
      title: props.title,
      importCss: props.importCss,
      importStyle: props.importStyle,
      loadCss: props.loadCss,
      delay: props.delay,
      beforePrintHandle: props.beforePrintHandle,
      afterPrintHandle: props.afterPrintHandle,
      debug: false
    })
  }

  return (
    <div className='msp-print-wrap'>
      {buttonRender({ onPrintf: handlePrintf })}
      <div style={{ display: 'none' }}>
        <div className='msp-print' ref={printRef}>
          {props.qrcodeProps && <QRCode {...props.qrcodeProps} />}
          {props.barcodeProps && <Barcode {...props.barcodeProps} />}
          <div className='print-content'>{children}</div>
        </div>
      </div>
    </div>
  )
}

Print.propTypes = {
  children: PropTypes.any.isRequired,
  // 打印按钮
  buttonRender: PropTypes.func,
  // 打印配置
  title: PropTypes.string,
  importCss: PropTypes.bool,
  importStyle: PropTypes.bool,
  loadCss: PropTypes.array,
  delay: PropTypes.number,
  beforePrintHandle: PropTypes.func,
  afterPrintHandle: PropTypes.func,
  // 二维码
  qrcodeProps: PropTypes.object,
  // 条形码
  barcodeProps: PropTypes.object
}

Print.defaultProps = {
  title: '',
  importCss: true,
  importStyle: true,
  loadCss: [],
  delay: 300
}

export default Print
