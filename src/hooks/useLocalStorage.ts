import { useState, useEffect, useCallback } from 'react'

export const useLocalStorage = <T,>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void] => {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = useCallback(
    (value: T) => {
      try {
        setStoredValue(value)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(value))
        }
      } catch (error) {
        console.log(error)
      }
    },
    [key]
  )

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue)
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key)
      }
    } catch (error) {
      console.log(error)
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
