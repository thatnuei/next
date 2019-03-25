import { useLayoutEffect, useMemo, useState } from "react"

function usePopup(ref: React.RefObject<HTMLElement>) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [style, setStyle] = useState<React.CSSProperties>({})

  useLayoutEffect(() => {
    const menu = ref.current
    if (!menu) return

    setStyle({
      position: "fixed",
      left: Math.min(position.x, window.innerWidth - menu.clientWidth),
      top: Math.min(position.y, window.innerHeight - menu.clientHeight),
    })
  }, [position.x, position.y, ref])

  return useMemo(() => {
    const openAt = (position: { x: number; y: number }) => {
      setPosition(position)
      setIsVisible(true)
    }

    const close = () => {
      setIsVisible(false)
    }

    return { openAt, close, isVisible, style }
  }, [isVisible, style])
}
export default usePopup
