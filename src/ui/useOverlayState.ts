import { useState } from "react"

export default function useOverlayState() {
  const [visible, setVisible] = useState(false)

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
