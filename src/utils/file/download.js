import { request } from '@/utils/request'

/**
 * 下载图片
 * @param url
 * @param fileName
 */
const download = (url, fileName) => {
  const aLink = document.createElement('a')
  aLink.style.display = 'none'
  aLink.href = url
  aLink.download = fileName || ''
  document.body.appendChild(aLink)
  aLink.click()
  document.body.removeChild(aLink)
}

const downloadByBlob = (content, fileName, type) => {
  const blob = new Blob([content], { type: type })
  // 生成ObjectURL
  const src = URL.createObjectURL(blob)
  // 下载
  download(src, fileName)
  // 释放URL对象
  URL.revokeObjectURL(src)
}

/**
 * 下载图片/文件
 * @param url
 * @param fileName
 * @returns {Promise<void>}
 */
const downloadFile = async (url, fileName) => {
  const res = await fetch(url, { method: 'GET', responseType: 'blob' }).then((res) => {
    return res.blob()
  })
  downloadByBlob(res, fileName, res.type)
}

/**
 * 导出文件
 * @param url
 * @param params
 * @param method
 * @returns {Promise<void>}
 */
const exportFile = async (url, params = {}, method = 'get') => {
  const res = await request(url, params, method, { responseType: 'blob' })
  const headers = decodeURI(
    res.headers['Content-Disposition'] || res.headers['content-disposition']
  )
  const fileName = headers.split("attachment;filename*=utf-8''").slice(-1).pop()

  downloadByBlob(res.data, fileName, 'application/octet-stream')
}

/**
 * 压缩图片
 * @param src
 * @param width
 * @param height
 * @param quality
 * @returns {Promise<unknown>}
 */
const compressImage = async (src, width, height, quality = 0.5) => {
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = async () => {
      width = width || image.width
      height = height || image.height
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      canvas.getContext('2d').drawImage(image, 0, 0, width, height)
      const canvasURL = canvas.toDataURL('image/jpeg', quality)
      resolve(canvasURL)
    }
    image.setAttribute('crossOrigin', 'Anonymous')
    image.src = src
  })
}

export { download, downloadFile, exportFile, compressImage }
