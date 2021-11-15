import { useReducer } from 'react'

export const useForceUpdate = () => {
  const [, forceUpdate] = useReducer((s) => s + 1, 0)

  return forceUpdate
}
