export const hasOwn = (config, key) => {
  return Object.prototype.hasOwnProperty.call(config, key)
}

export const disposeParams = (config) => {
  const key = config.method === 'get' ? 'params' : 'data'
  console.log(key)
}
