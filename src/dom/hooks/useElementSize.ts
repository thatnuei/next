import { useEffect, useMemo, useState } from "react"
import ResizeObserver from "resize-observer-polyfill"

export default function useElementSize(element: Element | null | undefined) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (!element) return

    const observer = new ResizeObserver(([info]) => {
      setWidth(info.contentRect.width)
      setHeight(info.contentRect.height)
    })

    observer.observe(element)

    return () => observer.disconnect()
  }, [element])

  return useMemo(() => ({ width, height }), [height, width])
}
