import React, { CSSProperties } from "react"
import Box from "../ui/Box"
import { styled } from "../ui/styled"
import { useOverlay } from "./OverlayContext"

type Props = {
  children?: React.ReactNode
  side?: "left" | "right"
}

const OverlaySidePanel = (props: Props) => {
  const overlay = useOverlay()

  const side = props.side || "left"

  const translation = side === "left" ? `-100%` : `100%`

  const positionStyle: CSSProperties =
    side === "left" ? { left: 0 } : { right: 0 }

  const transitionStyle: CSSProperties = overlay.isEntering
    ? { transform: `translateX(1%)` }
    : { transform: `translateX(${translation})` }

  const style: CSSProperties = {
    transition: `${overlay.transitionTimeout}ms`,
    ...positionStyle,
    ...transitionStyle,
  }

  return (
    <Panel elevated style={style}>
      {props.children}
    </Panel>
  )
}

export default OverlaySidePanel

const Panel = styled(Box)`
  position: absolute;
  top: 0;
  bottom: 0;
  width: max-content;

  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);

  > * {
    height: 100%;
  }
`
