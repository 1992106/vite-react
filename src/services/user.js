import { post, get } from '@/utils/request'

export async function login(data) {
  return post('/msp/account/user/login', data)
}

export async function getWxCpQrLoginCodeUrl() {
  return get('/msp/account/user/getWxCpQrLoginCodeUrl')
}

export async function wxCpQrLogin(params) {
  return get('/msp/account/user/wxCpQrLogin', params)
}
