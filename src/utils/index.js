/**
 * 获取对象tag
 * @param value
 * @returns {string}
 */
export const getTag = (value) => {
  return Object.prototype.toString.call(value)
}

/**
 * 获取对象类型
 * @param value
 * @returns {string}
 */
export const getType = (value) => {
  return getTag(value).slice(8, -1).toLowerCase()
}

/**
 * 是否为空
 * @param value
 * @returns {boolean}
 */
export const isEmpty = (value) => {
  if (value == null) {
    return true
  }
  if (Array.isArray(value) || typeof value === 'string' || value instanceof String) {
    return value.length === 0
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0
  }
  if (getTag(value) === '[object Object]') {
    return Object.keys(value).length === 0
  }
  return false
}

/**
 * 四舍五入
 * @param value 需要舍入的数
 * @param length 保留小数点后位数
 */
export function toFixed(value, length = 2) {
  if (typeof value === 'string') {
    value = Number(value)
  }
  if (typeof value !== 'number') {
    throw new Error('value不是数字')
  }
  return Math.round(Math.pow(10, length) * value) / Math.pow(10, length)
}

/**
 * 延迟函数
 * @param ms
 * @returns {Promise<unknown>}
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * 是否是promise
 * @param obj
 * @returns {boolean}
 */
export const isPromise = (obj) => {
  return (
    !!obj &&
    (typeof obj === 'object' || typeof obj === 'function') &&
    typeof obj.then === 'function'
  )
}

/**
 * 对象赋值
 * @param {Object} target 要赋值的对象
 * @param {Object} source 获取赋值数据的对象
 * @return {Object} 返回赋值后的target
 */
export function polyfill(target, source) {
  const obj = {}
  Object.keys(target).forEach((key) => {
    if (getType(target[key]) === 'object') {
      obj[key] = isEmpty(source[key]) ? target[key] : polyfill(target[key], source[key])
    } else {
      obj[key] = isEmpty(source[key]) ? target[key] : source[key]
    }
  })
  return obj
}

/**
 * 删除对象空值
 * @param object
 * @returns {*}
 */
export const toEmpty = (object) => {
  Object.keys(object).forEach((key) => {
    if (isEmpty(object[key])) {
      delete object[key]
    }
  })
  return object
}

/**
 * 格式化时间
 * @param date
 * @param fmt
 * @returns {*}
 */
export function dateFormat(date, fmt) {
  date = new Date(date)
  const o = {
    'M+': date.getMonth() + 1, // 月
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季节
    'd+': date.getDate(), // 日
    'H+': date.getHours(), // 时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    S: date.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (let k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      )
    }
  }
  return fmt
}

export function formatDate(value, format) {
  return dateFormat(value, format || 'yyyy-MM-dd')
}

export function formatTime(value, format) {
  return dateFormat(value, format || 'yyyy-MM-dd HH:mm:ss')
}

/**
 * 格式化url
 * @param queryString
 * @returns {{}}
 */
export function formatSearchParams(queryString) {
  const obj = {},
    reg = /([^?=&#]+)=([^?=&#]+)/g
  queryString.replace(reg, function () {
    const key = arguments[1]
    obj[key] = arguments[2]
  })
  return obj
}

/**
 * array格式化数据为label、value
 * @param data
 * @param label
 * @param value
 * @param disabled
 * @returns {any[]}
 */
export const formatOptions = (data, label, value = 'id', disabled = 'status') => {
  return (data || []).map((item) => {
    return {
      // ...item,
      label: item[label],
      value: item[value],
      ...(!isEmpty(item[disabled])
        ? { disabled: typeof item[disabled] === 'boolean' ? item[disabled] : !item[disabled] }
        : {})
    }
  })
}

/**
 * tree格式化数据为label、value
 * @param tree
 * @param children
 * @param label
 * @param value
 * @param disabled
 * @returns {*}
 */
export const treeFormatOptions = (
  tree,
  children = 'children',
  label,
  value = 'id',
  disabled = 'status'
) => {
  return (tree || []).reduce((arr, item) => {
    arr.push({
      // ...item,
      label: item[label],
      value: item[value],
      ...(!isEmpty(item[disabled])
        ? { disabled: typeof item[disabled] === 'boolean' ? item[disabled] : !item[disabled] }
        : {}),
      ...(!isEmpty(item[children])
        ? { children: treeFormatOptions(item[children], children, label, value, disabled) }
        : {})
    })
    return arr
  }, [])
}

/**
 * 把数组转成对象,一般用于数据回显
 * @param array
 * @param key
 * @param value
 * @returns {{}}
 */
export function arrayToObj(array, key = 'label', value = 'value') {
  let obj = {}
  array.forEach((item) => {
    obj[item[value]] = item[key]
  })
  return obj
}
