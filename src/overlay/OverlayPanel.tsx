import React, { CSSProperties } from "react"
import Box from "../ui/Box"
import { styled } from "../ui/styled"
import { gapSizes } from "../ui/theme"
import OverlayCloseButton from "./OverlayCloseButton"
import { useOverlay } from "./OverlayContext"

type Props = {
  children?: React.ReactNode
}

const OverlayPanel = (props: Props) => {
  const overlay = useOverlay()

  const style: CSSProperties = overlay.isEntering
    ? {
        transition: `${overlay.transitionTimeout}ms`,
        transform: `translateY(0)`,
      }
    : {
        transition: `${overlay.transitionTimeout}ms`,
        transform: `translateY(-30px)`,
      }

  return (
    <Container align="flex-end" gap={gapSizes.small} style={style}>
      <OverlayCloseButton />
      <Box background="theme0" elevated>
        {props.children}
      </Box>
    </Container>
  )
}

export default OverlayPanel

OverlayPanel.Header = (props: Props) => (
  <Box background="theme1" pad={gapSizes.small} align="center">
    <h2>{props.children}</h2>
  </Box>
)

const Container = styled(Box)`
  margin: auto;
  transition: 0.2s;
  width: 100%;
  max-width: max-content;

  /* ignore click events on this element, but not the children */
  pointer-events: none;
  > * {
    pointer-events: all;
  }
`
