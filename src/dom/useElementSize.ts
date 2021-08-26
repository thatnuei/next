import type { RefObject } from "react"
import { useEffect, useState } from "react"
import ResizeObserver from "resize-observer-polyfill"

export function useElementSize(
  ref: Element | RefObject<Element> | undefined | null,
) {
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref instanceof Element ? ref : ref?.current
    if (!element) return

    const observer = new ResizeObserver(([info]: ResizeObserverEntry[]) => {
      if (info) setSize(info.target.getBoundingClientRect())
    })
    observer.observe(element)
    return () => observer.disconnect()
  }, [ref])

  return size
}
