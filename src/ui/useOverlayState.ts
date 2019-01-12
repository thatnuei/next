import { useState } from "react"

export default function useOverlayState(initiallyVisible = false) {
  const [visible, setVisible] = useState(initiallyVisible)

  return {
    visible,
    setVisible,
    open: () => setVisible(true),
    close: () => setVisible(false),
    bind: {
      visible,
      onClick: () => setVisible(false),
    },
  }
}
