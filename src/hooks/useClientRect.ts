import { useCallback, useState } from 'react'

export const useClientRect = () => {
  const [rect, setRect] = useState({})
  const ref = useCallback((node) => {
    if (node !== null) {
      setRect(node.getBoundingClientRect())
    }
  }, [])
  return [rect, ref]
}
