import React from "react"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import { useOverlay } from "./OverlayContext"

export default function OverlayCloseButton() {
  const overlay = useOverlay()
  return (
    <FadedButton onClick={overlay.close}>
      <Icon icon="close" />
    </FadedButton>
  )
}
