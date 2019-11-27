import { useCallback, useEffect, useRef } from "react"

function useIsMounted() {
  const isMountedRef = useRef(false)

  useEffect(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  }, [])

  function isMounted() {
    return isMountedRef.current
  }

  return useCallback(isMounted, [])
}

export default useIsMounted
