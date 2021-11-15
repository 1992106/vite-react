export const initState = {
  // 表格默认配置
  defaultConfig: {
    rowKey: 'id',
    bordered: true,
    defaultSize: 'middle'
  },
  // 分页
  pagination: {
    current: 1,
    pageSize: 20
  },
  // 搜索栏
  search: {
    layout: 'horizontal',
    filterType: 'query',
    span: 8,
    labelWidth: 120
  },
  // 工具栏
  options: {
    reload: true,
    density: true,
    setting: true,
    fullScreen: true
  }
}
