import { post, get } from '@/utils/request'

// 分页查询子账号
export async function selectAccountPage(params) {
  return get('/msp/account/user/selectAccountPage', params)
}

// 创建子账号
export async function createAccount(data) {
  return post('/msp/account/user/createAccount', data)
}

// 删除子账号
export async function deleteAccount(data) {
  return post('/msp/account/user/deleteAccount', data)
}

// 修改密码
export async function changePassword(data) {
  return post('/msp/account/user/changePassword', data)
}

// 修改子账号手机号码
export async function changePhone(data) {
  return post('/msp/account/user/changePhone', data)
}

// 启用子账号
export async function enableAccount(data) {
  return post('/msp/account/user/enableChild', data)
}

// 禁用
export async function disableAccount(data) {
  return post('/msp/account/user/disable', data)
}
