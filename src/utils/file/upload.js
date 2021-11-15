import { post } from '@/utils/request'

// 获取签名
const getAWSSign = async ({ name, type }) => {
  return await post('/mrp/base/image/properties', {
    fileName: name,
    mimeType: type
  })
}

// 上传AWS的OSS
const uploadAWSOSS = async (sign, file) => {
  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('key', sign['key'])
    formData.append('Policy', sign['policy'])
    formData.append('X-Amz-Algorithm', sign['xamzAlgorithm'])
    formData.append('X-Amz-Credential', sign['xamzCredential'])
    formData.append('X-Amz-Date', sign['xamzDate'])
    formData.append('X-Amz-Signature', sign['xamzSignature'])
    formData.append('file', file)
    fetch(sign.endPoint, {
      method: 'POST',
      body: formData
    })
      .then(() => {
        resolve()
      })
      .catch(() => {
        reject('上传AWS失败')
      })
  })
}

// 确认上传
const commitUpload = async ({ name, type, key }) => {
  return await post('/mrp/base/image/commit', {
    fileName: name,
    mimeType: type,
    key: key
  })
}

/**
 * 上传文件
 * @param option
 * @returns {Promise<any>}
 */
export const uploadFile = async (option) => {
  const { file } = option
  let { name, type } = file
  type = type || 'application/octet-stream'
  try {
    // 第一步
    const { data: sign } = await getAWSSign({ name, type })
    // 第二步
    await uploadAWSOSS(sign, file)
    // 第三步
    return await commitUpload({ key: sign.key, name, type })
  } catch (e) {
    return Promise.reject(e)
  }
}
