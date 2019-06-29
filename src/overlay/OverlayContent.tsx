import { observer } from "mobx-react-lite"
import React, { CSSProperties } from "react"
import styled from "styled-components"
import Box, { BoxProps } from "../ui/Box"
import { spacing } from "../ui/theme"
import { useOverlay } from "./OverlayContext"

type Props = BoxProps & {
  maxWidth?: string | number
}

const OverlayContent = ({ style, maxWidth, ...props }: Props) => {
  const overlay = useOverlay()

  const baseStyle = {
    maxWidth: maxWidth || "max-content",
    ...style,
  }

  const transitionStyle: CSSProperties = overlay.isVisible
    ? { transform: `translateY(0)` }
    : { transform: `translateY(-30px)` }

  return (
    <Container
      align="flex-end"
      justify="center"
      pad={spacing.medium}
      gap={spacing.small}
      style={{ ...transitionStyle, ...baseStyle }}
      {...props}
    >
      {props.children}
    </Container>
  )
}
export default observer(OverlayContent)

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
