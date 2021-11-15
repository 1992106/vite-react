import { post, get } from '@/utils/request'

// 左侧统计
export async function getStatistics(params) {
  return get('/msp/sales-order/order/statistics', params)
}

// 分页查询
export async function selectPage(data) {
  return post('/msp/sales-order/order/selectPage', data)
}

// 分页查询-待发货列表
export async function selectInvoicePage(data) {
  return post('/msp/sales-order/order/selectInvoicePage', data)
}

// 打印标签
export async function printInvoiceTag(data) {
  return post('/msp/sales-order/order/printInvoiceTag', data)
}

// 打印发货单
export async function printInvoiceOrder(data) {
  return post('/msp/sales-order/order/printInvoiceOrder', data)
}

// 举报飞单
export async function reportBrokenOrder(data) {
  return post('/msp/sales-order/order/reportBrokenOrder', data)
}

// 报告缺货
export async function reportAbnormal(data) {
  return post('/msp/sales-order/order/reportAbnormal', data)
}

// 批量接单
export async function batchAcceptOrder(data) {
  return post('/msp/sales-order/order/batchAcceptOrder', data)
}

// 批量配货
export async function batchDistributeOrder(data) {
  return post('/msp/sales-order/order/batchDistributeOrder', data)
}

// 查询纸样花型图片
export async function selectUrls(params) {
  return get('/msp/sales-order/order/selectUrls', params)
}

// 批量取消配货
export async function batchCancelDistributeOrder(data) {
  return post('/msp/sales-order/order/batchCancelDistributeOrder', data)
}

// 批量发货
export async function invoiceOrder(data) {
  return post('/msp/sales-order/order/invoiceOrder', data)
}

// 查询成衣加工厂
export async function selectFactoryList(params) {
  return get('/msp/sales-order/order/selectFactoryList', params)
}
