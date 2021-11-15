import React, { Fragment, useEffect, useState } from 'react'
import Modal from '@/components/Modal'
import { Button, Tag } from 'antd'
import { getDetail, setRead } from '@/services/dashboard'
import './index.less'

const ViewNotice = (props) => {
  const [state, setState] = useState({
    detailData: {},
    previousLoading: false,
    nextLoading: false
  })

  const getNoteDetail = async (noteId) => {
    if (noteId == null) return
    const res = await getDetail({ noteId })
    if (res?.status === 200) {
      setState((val) => {
        return { ...val, detailData: res?.data }
      })
      // 标为已读
      if (res?.data?.isRead === 0) {
        await setRead({ noteId })
      }
    }
  }

  useEffect(() => {
    getNoteDetail(props?.rowData?.noteId)
  }, [])

  const handlePrevious = async () => {
    const noteId = state.detailData?.preNoteId
    if (noteId) {
      setState((val) => ({ ...val, previousLoading: true }))
      await getNoteDetail(noteId)
      setState((val) => ({ ...val, previousLoading: false }))
    }
  }

  const handleNext = async () => {
    const noteId = state.detailData?.nextNoteId
    if (noteId) {
      setState((val) => ({ ...val, nextLoading: true }))
      await getNoteDetail(noteId)
      setState((val) => ({ ...val, nextLoading: false }))
    }
  }

  const handleCancel = () => {
    props?.onVisible()
    props?.done() // 刷新列表
  }

  const Title = (
    <div>
      {state.detailData?.isRead === 0 && <Tag color='#f00'>New</Tag>}
      {state.detailData?.noteTitle}
    </div>
  )

  return (
    <Modal
      visible={props?.visible}
      title={Title}
      width={960}
      onCancel={handleCancel}
      footer={[
        <Button key='cancel' onClick={handleCancel}>
          关闭
        </Button>,
        <Fragment key='previous'>
          {state.detailData?.preNoteId && (
            <Button type='primary' loading={state.previousLoading} onClick={handlePrevious}>
              上一条
            </Button>
          )}
        </Fragment>,
        <Fragment key='next'>
          {state.detailData?.nextNoteId && (
            <Button type='primary' loading={state.nextLoading} onClick={handleNext}>
              下一条
            </Button>
          )}
        </Fragment>
      ]}>
      <div
        className='node-content'
        dangerouslySetInnerHTML={{ __html: state.detailData?.content }}
      />
    </Modal>
  )
}

export default ViewNotice
