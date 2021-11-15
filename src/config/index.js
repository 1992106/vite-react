const setting = {
  // 项目标题
  title: 'PatPat MSP | 协同门户',

  // 请求超时
  request_timeout: 3000,

  // 请求时headers内存放token的名字
  authorization_name: 'Authorization',

  // 本地储存token的名字
  token_name: 'msp-token',

  // token前缀,设置为null则不启用 { headers: { Authorization: 'Bearer ${token}'}}
  token_prefix: 'Bearer',

  // 本地储存user的名称
  user_name: 'msp-user',

  // 本地储存api的名称
  api_name: 'msp-api',

  // 是否开启keep-alive
  keep_alive: true,

  // iconfont字体URL
  iconfont_url: '//at.alicdn.com/t/font_2586401_hpfdztbpdba.js'
}

export default setting
