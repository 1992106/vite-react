import axios from 'axios'
import { message, notification } from 'antd'
import { createBrowserHistory } from 'history'
import setting from '@/src/config'
import { omit } from 'lodash-es'
import { getAccessStorage } from '@/utils/accessStorage'

// 全局axios默认值
axios.defaults.baseURL = import.meta.env.VITE_API_BASE_URL
axios.defaults.timeout = setting.request_timeout

// 创建axios实例
const httpService = axios.create()

// 添加请求拦截器
httpService.interceptors.request.use(
  (config) => {
    const apiUrl = getAccessStorage(setting.api_name)
    const token = getAccessStorage(setting.token_name)
    if (apiUrl) config.baseURL = apiUrl
    if (token) config.headers[setting.authorization_name] = `${setting.token_prefix} ${token}`
    config.headers['X-Request-Id'] = 'MSP'
    // 合并自定义配置
    const options = omit(config?.options, ['$msg'])
    Object.assign(config, options)
    // console.log(config, 'request config')
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
httpService.interceptors.response.use(
  (response) => {
    // 过滤文件流格式
    if (!response.headers['content-type'].includes('application/json')) {
      return response
    }
    const { data, config } = response
    const code = data.status
    // 是否有自定义$msg
    const hasMsg = config?.options['$msg'] !== 'none'
    const msg = config?.options['$msg'] || data.msg
    if (code === 200) {
      // 业务操作提示：增删改
      if (msg && hasMsg) {
        message.success(msg)
      }
      return response
    } else {
      // 除200外，其它状态（[500]）业务错误提示
      if (hasMsg) {
        notification.error({ message: '系统提示', description: msg })
      }
      return Promise.reject(response)
    }
  },
  (error) => {
    if (error?.response) {
      const { data, status, config } = error.response
      // 401：token过期、403权限变更
      if ([401, 403].includes(status)) {
        // 创建路由
        const history = createBrowserHistory()
        const {
          location: { pathname }
        } = history
        if (pathname !== '/login') {
          history.push('/login')
          window.location.reload() // TODO: history不会跳转到login，所以reload一下
        }
      }
      notification.error({
        message: `${status}错误：${config.url}`,
        description: data?.msg || '未知错误'
      })
    } else {
      notification.error({ message: '系统错误', description: '连接到服务器失败！' })
    }
    // return Promise.reject(error)
    return Promise.reject()
  }
)

export default httpService
