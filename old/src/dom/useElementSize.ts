import { useEffect, useState } from "react"
import ResizeObserver from "resize-observer-polyfill"

export function useElementSize(element: Element | undefined | null) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!element) return

    const observer = new ResizeObserver(([info]) => setSize(info.contentRect))
    observer.observe(element)
    return () => observer.disconnect()
  }, [element])

  return size
}
