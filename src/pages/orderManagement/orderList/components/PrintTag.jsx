import React from 'react'
import Barcode from '@/components/Barcode'
import './index.less'

const PrintTag = ({ tagsData }) => {
  return (
    <div className='print-tag-wrap'>
      {tagsData.map((tag, index) => (
        <div key={index} style={{ pageBreakAfter: 'always' }}>
          <div className='flex barcode'>
            <div>
              <Barcode codeValue={tag?.invoiceNo} />
            </div>
            <div>
              第{tag?.index}条/共{tag?.distributionItemNum}条
            </div>
          </div>
          <div className='flex content'>
            <span>收货方</span>
            <div>
              <p>{tag?.factoryName}</p>
              <p>
                {tag?.factoryContact} {tag?.factoryPhone}
              </p>
              <p>{tag?.factoryAddress}</p>
            </div>
          </div>
          <div className='flex content'>
            <span>发货方</span>
            <div>
              <p>{tag?.supplierName}</p>
              <p>
                {tag?.supplierMaterialCode} {tag?.supplierMaterialName}
              </p>
              <p>色号: {tag?.supplierMaterialColorNo}</p>
              <p>
                发货数: {tag?.distributionNum} {tag?.unit}
              </p>
              <p>大货款号: {tag?.goodsNo?.join(',')}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PrintTag
