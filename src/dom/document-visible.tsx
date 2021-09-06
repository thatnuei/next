import { useEffect, useState } from "react"

export function useDocumentVisibleListener(
  listener: (state: VisibilityState) => void,
) {
  useEffect(() => {
    const handler = () => listener(document.visibilityState)
    document.addEventListener("visibilitychange", handler)
    return () => {
      document.removeEventListener("visibilitychange", handler)
    }
  })
}

export function useDocumentVisible() {
  const [isVisible, setIsVisible] = useState(
    document.visibilityState === "visible",
  )

  useDocumentVisibleListener((state) => {
    setIsVisible(state === "visible")
  })

  return isVisible
}
