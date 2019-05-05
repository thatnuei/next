import { observer } from "mobx-react-lite"
import React, { CSSProperties } from "react"
import { onlyOnSelf } from "../common/eventHelpers"
import Box from "../ui/Box"
import { semiBlack } from "../ui/colors"
import { fullscreen } from "../ui/helpers"
import { styled } from "../ui/styled"
import { useOverlay } from "./OverlayContext"

type Props = {
  children?: React.ReactNode
}

function OverlayShade(props: Props) {
  const overlay = useOverlay()

  const transitionStyle: CSSProperties = overlay.isVisible
    ? { opacity: 1, visibility: "visible" }
    : { opacity: 0, visibility: "hidden" }

  return (
    <Shade
      overflowX="hidden"
      overflowY="auto"
      {...props}
      style={transitionStyle}
      onClick={onlyOnSelf(overlay.close)}
    />
  )
}

export default observer(OverlayShade)

const Shade = styled(Box)`
  ${fullscreen};
  transition: 0.3s;
  opacity: 0;
  background-color: ${semiBlack(0.5)};
  z-index: 1;
`
