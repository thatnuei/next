import { observer } from "mobx-react-lite"
import React, { CSSProperties } from "react"
import Box from "../ui/Box"
import { styled } from "../ui/styled"
import { gapSizes } from "../ui/theme"
import OverlayCloseButton from "./OverlayCloseButton"
import { useOverlay } from "./OverlayContext"

type Props = {
  children?: React.ReactNode
  maxWidth?: string | number
}

const OverlayPanel = (props: Props) => {
  const overlay = useOverlay()

  const baseStyle: CSSProperties = {
    maxWidth: props.maxWidth || "max-content",
  }

  const transitionStyle: CSSProperties = overlay.isVisible
    ? { transform: `translateY(0)` }
    : { transform: `translateY(-30px)` }

  return (
    <Container
      align="flex-end"
      justify="center"
      pad={gapSizes.medium}
      gap={gapSizes.small}
      style={{ ...baseStyle, ...transitionStyle }}
    >
      <OverlayCloseButton />
      <Box width="100%" background="theme0" elevated>
        {props.children}
      </Box>
    </Container>
  )
}

export default observer(OverlayPanel)

export const OverlayPanelHeader = (props: Props) => (
  <Box background="theme1" pad={gapSizes.small} align="center">
    <h2>{props.children}</h2>
  </Box>
)

const Container = styled(Box)`
  margin: auto;
  transition: 0.3s;
  width: 100%;
  height: 100%;

  /* ignore click events on this element, but not the children */
  pointer-events: none;
  > * {
    pointer-events: all;
  }
`
