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

  const style: CSSProperties = overlay.isEntering
    ? {
        transition: `${overlay.transitionTimeout}ms`,
        transform: `translateX(0)`,
      }
    : {
        transition: `${overlay.transitionTimeout}ms`,
        transform: `translateX(-100%)`,
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
