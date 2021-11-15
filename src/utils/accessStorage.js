import setting from '@/src/config'

const { token_name } = setting

const getAccessStorage = (key = token_name) => {
  return localStorage.getItem(key) || ''
}

const setAccessStorage = (key = token_name, value) => {
  return localStorage.setItem(key, value)
}

const removeAccessStorage = (key = token_name) => {
  return localStorage.removeItem(key)
}

export { getAccessStorage, setAccessStorage, removeAccessStorage }
