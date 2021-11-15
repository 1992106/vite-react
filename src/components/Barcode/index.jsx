import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import JsBarcode from 'jsbarcode'

const Barcode = (props) => {
  const barcodeRef = useRef(null)

  const generateBarcode = useCallback(() => {
    if (props.codeValue) {
      JsBarcode(barcodeRef.current, props.codeValue, {
        format: props.format,
        width: props.width,
        height: props.height,
        text: props.codeValue,
        lineColor: props.lineColor,
        displayValue: false
      })
    }
  }, [props])

  useEffect(() => {
    generateBarcode()
  }, [generateBarcode])

  return (
    <>
      <img ref={barcodeRef} alt='条形码' />
      {props.displayValue && (
        <p style={{ textAlign: 'center', fontSize: '20px', marginTop: '-6px', color: '#000' }}>
          {props.text || props.codeValue}
        </p>
      )}
    </>
  )
}

Barcode.propTypes = {
  codeValue: PropTypes.string.isRequired,
  format: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  text: PropTypes.string,
  lineColor: PropTypes.string,
  displayValue: PropTypes.bool
}

Barcode.defaultProps = {
  format: 'CODE128',
  width: 2,
  height: 40,
  lineColor: '#000',
  displayValue: true
}

export default Barcode
