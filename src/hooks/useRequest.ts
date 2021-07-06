import { useState, useEffect, useCallback } from 'react'
import request from '@/utils/request'

interface ParamsType {
  query?: String
  mutation?: String
  variables?: any
}
interface StateType {
  data: object
  loading: boolean
  error: any
}

export function useRequest(
  initialParams: ParamsType | ParamsType[],
  initialData: any
): [StateType, any] {
  const [params, setParams] = useState(initialParams)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(initialData)
  const [error, setError] = useState(null)

  const paramsJson = JSON.stringify(params)

  useEffect(() => {
    ;(async () => {
      try {
        setLoading(true)
        // TODO: URL
        const { data = {} } = (await request('', params)) || {}
        setData(data)
      } catch (err) {
        setError(err)
      } finally {
        setLoading(false)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsJson])

  const search = useCallback(e => setParams(e), [])
  return [{ data, loading, error }, search]
}
