import { post, get } from '@/utils/request'

// 单枚举类型的枚举值下拉框
export async function getSelects(params) {
  return get('/mrp/base/enum/getSelects', params)
}

// 多枚举类型的枚举值下拉框
export async function getListSelects(data) {
  return post('/mrp/base/enum/getListSelects', data)
}
