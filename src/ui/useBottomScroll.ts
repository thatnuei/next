import { useEffect, useRef } from "react"

export default function useBottomScroll<E extends HTMLElement>(value: unknown) {
  const elementRef = useRef<E>(null)
  const element = elementRef.current

  const scrolledToBottom =
    element != null &&
    element.scrollTop >= element.scrollHeight - element.clientHeight - 100

  useEffect(
    () => {
      if (!element || !scrolledToBottom) return
      element.scrollTop = element.scrollHeight
    },
    [value],
  )

  return elementRef
}
