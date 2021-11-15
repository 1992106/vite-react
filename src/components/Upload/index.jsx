import React, { useEffect, useReducer, useState } from 'react'
import PropTypes from 'prop-types'
import { Button, Modal, Upload } from 'antd'
import { PlusOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import { uploadFile } from '@/utils/file/upload'

import './index.less'

const prefixCls = 'my-upload'

const initState = {
  visible: false,
  title: '',
  image: ''
}

const reducer = (state = {}, action) => {
  switch (action.type) {
    case 'imagePreview':
      return Object.assign({}, state, action.payload)
    case 'cancelPreview':
      return Object.assign({}, state, { visible: action.payload })
    default:
      return state
  }
}

const UploadComponent = ({ fileList, onChange, ...props }) => {
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(reducer, initState)

  useEffect(() => {
    if (Array.isArray(fileList)) {
      setFiles(fileList.map((val) => ({ ...val, name: val?.filename })))
    }
  }, [fileList])

  // 默认props，不支持外部修改
  const defaultProps = {
    multiple: false,
    onSuccess(fileList) {
      onChange(fileList)
    },
    onError(err) {
      console.error(err, '上传失败！')
    },
    customRequest({ file, onError, onSuccess }) {
      const { needLoading } = props
      needLoading && setLoading(needLoading)
      uploadFile(file)
        .then((res) => {
          const fileList = [{ ...res, name: res?.filename }]
          setFiles(fileList)
          onSuccess(fileList, file)
          needLoading && setLoading(false)
        })
        .catch((err) => {
          onError(err)
          needLoading && setLoading(false)
        })
    }
  }

  const handlePreview = (file) => {
    dispatch({
      type: 'imagePreview',
      payload: {
        image: file?.url,
        visible: true,
        title: file?.filename
      }
    })
  }

  const handleCancel = () => {
    dispatch({ type: 'cancelPreview', payload: false })
  }

  const handleRemove = (file) => {
    const index = files.findIndex((val) => val.url === file.url)
    files.splice(index, 1)
    setFiles(files)
    onChange(files)
  }

  const {
    listType = 'text',
    uploadText = 'Upload',
    buttonType = 'primary',
    buttonDisabled = false
  } = props
  const uploadButton = (
    <Button
      type={buttonType}
      disabled={buttonDisabled}
      icon={loading ? <LoadingOutlined /> : <UploadOutlined />}>
      {loading ? '上传中' : uploadText}
    </Button>
  )

  const uploadCard = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>{uploadText}</div>
    </div>
  )

  return (
    <>
      {' '}
      {listType === 'text' ? (
        <Upload
          {...props}
          {...defaultProps}
          showUploadList={false}
          listType={listType}
          className={`${prefixCls}-picture`}>
          {uploadButton}
        </Upload>
      ) : (
        <>
          <Upload
            {...props}
            {...defaultProps}
            fileList={files}
            listType={listType}
            maxCount={1}
            className={`${prefixCls}-picture`}
            onPreview={handlePreview}
            onRemove={handleRemove}>
            {files.length === 0 && (listType === 'picture-card' ? uploadCard : uploadButton)}
          </Upload>
          <Modal visible={state.visible} title={state.title} footer={null} onCancel={handleCancel}>
            <img alt={state.title} style={{ width: '100%' }} src={state.image} />
          </Modal>
        </>
      )}
    </>
  )
}

UploadComponent.propTypes = {
  fileList: PropTypes.array,
  onChange: PropTypes.func,
  needLoading: PropTypes.bool,
  listType: PropTypes.oneOf(['text', 'picture', 'picture-card']),
  uploadText: PropTypes.string,
  buttonType: PropTypes.oneOf(['primary', 'ghost', 'dashed', 'link', 'text', 'default']),
  buttonDisabled: PropTypes.bool
}

export default UploadComponent
