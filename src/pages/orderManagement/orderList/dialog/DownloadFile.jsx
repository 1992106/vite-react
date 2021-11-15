import React, { useEffect, useState } from 'react'
import { Button, Table } from 'antd'
import Modal from '@/components/Modal'
import { downloadFile } from '@/utils/file/download'
import { selectUrls } from '@/services/orderManagement'

const DownloadFile = ({ visible, onVisible, rowData }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    ;(async () => {
      const res = await selectUrls({ id: rowData?.id })
      if (res.data) {
        setData(res.data)
      }
    })()
  }, [])

  const columns = [
    {
      title: '大货款号',
      dataIndex: 'goodNo'
    },
    {
      title: '纸样文件',
      dataIndex: 'patterns',
      render: (text) => {
        return (
          <>
            {text.length > 0 ? (
              <Button type='link' onClick={() => handleDownload(text)}>
                纸样下载
              </Button>
            ) : (
              '--'
            )}
          </>
        )
      }
    },
    {
      title: '花型文件',
      dataIndex: 'flowers',
      render: (text) => {
        return (
          <>
            {text.length > 0 ? (
              <Button type='link' onClick={() => handleDownload(text)}>
                花型下载
              </Button>
            ) : (
              '--'
            )}
          </>
        )
      }
    }
  ]

  // 下载
  const handleDownload = (text) => {
    ;(text || []).forEach((file) => {
      if (!file.url) return
      setTimeout(() => {
        downloadFile(file.url, file.fileName)
      }, 200)
    })
  }

  return (
    <Modal visible={visible} title='文件下载' width={520} footer={null} onCancel={onVisible}>
      <Table
        bordered
        rowKey={(record) => record?.goodNo}
        size='small'
        columns={columns}
        dataSource={data}
        pagination={false}
      />
    </Modal>
  )
}

export default DownloadFile
