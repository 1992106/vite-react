import { useEffect, useRef } from 'react'
import type { DependencyList, EffectCallback } from 'react'

// 使用上与 useEffect 完全相同，只是它忽略了首次渲染，且只在依赖项更新时运行
export const useUpdateEffect = (effect: EffectCallback, deps?: DependencyList): void => {
  const isMounted = useRef(false)

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true
    } else {
      return effect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
