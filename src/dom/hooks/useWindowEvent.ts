import { useEffect } from "react"

function useWindowEvent<E extends keyof WindowEventMap>(
  event: E,
  handler: (event: WindowEventMap[E]) => void,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    window.addEventListener(event, handler, options)
    return () => window.removeEventListener(event, handler)
  }, [event, handler, options])
}
export default useWindowEvent
