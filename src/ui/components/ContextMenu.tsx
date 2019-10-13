import React, { useState } from "react"
import { FocusOn } from "react-focus-on"
import clamp from "../../common/helpers/clamp"
import useWindowDimensions from "../../dom/hooks/useWindowDimensions"
import createContextWrapper from "../../react/helpers/createContextWrapper"
import { resolveStyleUnit } from "../helpers"
import { styled } from "../styled"
import { getThemeColor, shadows } from "../theme"
import { Position } from "../types"

type Props = {
  position: Position
  children: React.ReactNode
  visible: boolean
  onClose: () => void
}

const edgeSpacing = 10

function ContextMenu(props: Props) {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  const windowSize = useWindowDimensions()

  const getDimensions = (element: HTMLElement | null) => {
    if (!element) return
    setWidth(element.clientWidth || 0)
    setHeight(element.clientHeight || 0)
  }

  const boundedPosition = {
    x: clamp(
      props.position.x,
      edgeSpacing,
      windowSize.width - width - edgeSpacing,
    ),
    y: clamp(
      props.position.y,
      edgeSpacing,
      windowSize.height - height - edgeSpacing,
    ),
  }

  return (
    <Container
      position={boundedPosition}
      visible={props.visible}
      ref={getDimensions}
    >
      <FocusOn
        enabled={props.visible}
        onClickOutside={props.onClose}
        onEscapeKey={props.onClose}
      >
        <useContextMenuContext.Provider close={props.onClose}>
          {props.children}
        </useContextMenuContext.Provider>
      </FocusOn>
    </Container>
  )
}

export default ContextMenu

export const useContextMenuContext = createContextWrapper(
  (props: { close: () => void }) => props,
)

const Container = styled.div<{ position: Position; visible: boolean }>`
  position: fixed;
  left: ${({ position }) => resolveStyleUnit(position.x)};
  top: ${({ position }) => resolveStyleUnit(position.y)};

  background-color: ${getThemeColor("theme0")};
  width: 200px;
  box-shadow: ${shadows.normal};

  transition: 0.2s;
  transition-property: opacity, visibility, transform;

  ${({ visible }) =>
    visible
      ? { opacity: 1, visibility: "visible" }
      : { opacity: 0, visibility: "hidden" }}

  ${({ visible }) =>
    visible
      ? { transform: `translateY(0)` }
      : { transform: `translateY(20px)` }}
`
