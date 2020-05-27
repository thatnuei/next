import { RefObject, useEffect, useRef } from "react"

/**
 * Use this when you want to read a value in useEffect/useCallback
 * without it being a dependency
 */
export function useEffectRef<T>(value: T) {
  const ref = useRef(value)
  useEffect(() => {
    ref.current = value
  })
  return ref as RefObject<T>
}
