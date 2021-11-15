import { post, get } from '@/utils/request'

// 公告列表分页查询
export async function selectPage(data) {
  return post('/msp/api/NoteReceiveInfo/selectPage', data)
}

// 公告已读
export async function setRead(params) {
  return get('/msp/api/NoteReceiveInfo/read', params)
}

// 公告详情查询
export async function getDetail(params) {
  return get('/msp/api/NoteReceiveInfo/getDetail', params)
}
