import { useEffect } from "react"

export default function useWindowEvent<E extends keyof WindowEventMap>(
  event: E,
  handler: (event: WindowEventMap[E]) => void,
) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
