import React, { useReducer, useContext, useRef } from 'react'
import PropTypes from 'prop-types'
import { Modal } from 'antd'
import Draggable from 'react-draggable'
import './index.less'
import classNames from 'classnames'

const prefixCls = 'my-modal'

const ModalContext = React.createContext(null)

const initState = {
  disabled: true,
  bounds: { left: 0, top: 0, bottom: 0, right: 0 }
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'setDisabled':
      return Object.assign({}, state, { disabled: action.payload })
    case 'setBounds':
      return Object.assign({}, state, { bounds: action.payload })
    default:
      return state
  }
}

const ModalHeader = () => {
  const { title = 'Modal', dispatch } = useContext(ModalContext)

  return (
    <div
      className={`${prefixCls}-header`}
      onMouseOver={() => dispatch({ type: 'setDisabled', payload: false })}
      onMouseOut={() => dispatch({ type: 'setDisabled', payload: true })}>
      {title}
    </div>
  )
}

const ModalRender = ({ modal }) => {
  const draggableRef = useRef()
  const { state, dispatch } = useContext(ModalContext)

  const onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement
    const targetRect = draggableRef?.current?.getBoundingClientRect()
    dispatch({
      type: 'setBounds',
      payload: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y)
      }
    })
  }

  return (
    <Draggable
      disabled={state.disabled}
      bounds={state.bounds}
      onStart={(event, uiData) => onStart(event, uiData)}>
      <div ref={draggableRef}>{modal}</div>
    </Draggable>
  )
}

ModalRender.propTypes = {
  modal: PropTypes.any
}

const ModalComponent = ({ children, ...props }) => {
  const [state, dispatch] = useReducer(reducer, initState)

  const { className, title, ...restProps } = props

  return (
    <ModalContext.Provider value={{ state, dispatch, title }}>
      <Modal
        {...restProps}
        className={classNames(`${prefixCls}`, className)}
        title={<ModalHeader />}
        modalRender={(modal) => <ModalRender modal={modal} />}>
        {children}
      </Modal>
    </ModalContext.Provider>
  )
}

ModalComponent.propTypes = {
  children: PropTypes.any.isRequired,
  width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  title: PropTypes.any,
  className: PropTypes.string,
  maskClosable: PropTypes.bool
}

ModalComponent.defaultProps = {
  width: 960,
  maskClosable: import.meta.env.DEV
}

export default ModalComponent
