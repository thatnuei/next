import { useState } from "react"
import { useWindowEvent } from "./useWindowEvent"

export function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useWindowEvent("resize", () => {
    setSize({ width: window.innerWidth, height: window.innerHeight })
  })

  return size
}
