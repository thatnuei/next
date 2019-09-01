import React, { ComponentPropsWithoutRef } from "react"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import { useOverlay } from "./OverlayContext"

export default function OverlayCloseButton(
  props: ComponentPropsWithoutRef<typeof FadedButton>,
) {
  const overlay = useOverlay()
  return (
    <FadedButton onClick={overlay.close} {...props}>
      <Icon icon="close" />
    </FadedButton>
  )
}
