import React, { CSSProperties } from "react"
import { onlyOnSelf } from "../common/eventHelpers"
import Box from "../ui/Box"
import { semiBlack } from "../ui/colors"
import { fullscreen } from "../ui/helpers"
import { styled } from "../ui/styled"
import { gapSizes } from "../ui/theme"
import { useOverlay } from "./OverlayContext"

type Props = {
  children?: React.ReactNode
}

export default function OverlayShade(props: Props) {
  const overlay = useOverlay()

  const defaultStyle = {
    transition: `${overlay.transitionTimeout}ms opacity`,
    opacity: 0,
  }

  const transitionStyle: CSSProperties = overlay.isEntering
    ? { opacity: 1 }
    : { opacity: 0 }

  const style = {
    ...defaultStyle,
    ...transitionStyle,
  }

  return (
    <Shade
      overflowY="auto"
      pad={gapSizes.medium}
      {...props}
      style={style}
      onClick={onlyOnSelf(overlay.close)}
    />
  )
}

const Shade = styled(Box)`
  ${fullscreen};
  background-color: ${semiBlack(0.5)};
  z-index: 1;
`
