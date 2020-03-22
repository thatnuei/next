import { useEffect } from "react"

export function useWindowEvent<E extends keyof WindowEventMap>(
  event: E,
  listener: (event: WindowEventMap[E]) => void,
) {
  useEffect(() => {
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  })
}
