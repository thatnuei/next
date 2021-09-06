import { useEffect } from "react"

export function useTimeoutCallback(duration: number, callback: () => void) {
  useEffect(() => {
    const id = setTimeout(callback, duration)
    return () => clearTimeout(id)
  }, [callback, duration])
}
