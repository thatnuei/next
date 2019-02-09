import { useEffect } from "react"

export default function useBottomScroll<E extends HTMLElement>(
  elementRef: React.RefObject<E>,
  value: unknown,
) {
  const element = elementRef.current
  const wasBottomScrolled =
    element != null &&
    element.scrollTop >= element.scrollHeight - element.clientHeight - 100

  const scrollToBottom = () => {
    const element = elementRef.current
    if (!element) return
    element.scrollTop = element.scrollHeight
  }

  useEffect(scrollToBottom, [element])

  useEffect(() => {
    if (wasBottomScrolled) scrollToBottom()
  }, [value])
}
