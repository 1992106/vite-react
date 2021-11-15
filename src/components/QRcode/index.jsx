import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import JsQrcode from 'qrcodejs2-fix'

const QRCode = (props) => {
  const qrcodeRef = useRef(null)

  const generateQRCode = useCallback(() => {
    if (props.text) {
      // 生成二维码先清空旧的
      if (qrcodeRef.current) {
        qrcodeRef.current.innerHTML = ''
      }
      new JsQrcode(qrcodeRef.current, {
        text: props.text,
        width: props.width,
        height: props.height,
        colorDark: props.colorDark,
        colorLight: props.colorLight,
        correctLevel: JsQrcode?.CorrectLevel.L
      })
    }
  }, [props])

  useEffect(() => {
    generateQRCode()
  }, [generateQRCode])

  return <div ref={qrcodeRef} />
}

QRCode.propTypes = {
  text: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  colorDark: PropTypes.string,
  colorLight: PropTypes.string
}

QRCode.defaultProps = {
  width: 120,
  height: 120,
  colorDark: '#000',
  colorLight: '#fff'
}

export default QRCode
