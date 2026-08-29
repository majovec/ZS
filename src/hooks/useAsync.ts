import { useState, useCallback, useEffect } from 'react'

interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true
): AsyncState<T> & { refetch: () => Promise<void> } => {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: immediate,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })
    try {
      const result = await asyncFunction()
      setState({ data: result, loading: false, error: null })
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
      })
    }
  }, [asyncFunction])

  useEffect(() => {
    if (immediate) {
      execute()
    }
  }, [execute, immediate])

  return { ...state, refetch: execute }
}
