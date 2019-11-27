import React, { useContext, useMemo, useState } from "react"
import { FocusOn } from "react-focus-on"
import clamp from "../../common/helpers/clamp"
import useElementSize from "../../dom/hooks/useElementSize"
import useWindowDimensions from "../../dom/hooks/useWindowDimensions"
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
  const [container, setContainer] = useState<Element | null>()
  const containerSize = useElementSize(container)
  const windowSize = useWindowDimensions()

  const boundedPosition = {
    x: clamp(
      props.position.x,
      edgeSpacing,
      windowSize.width - containerSize.width - edgeSpacing,
    ),
    y: clamp(
      props.position.y,
      edgeSpacing,
      windowSize.height - containerSize.height - edgeSpacing,
    ),
  }

  const contextValue = useMemo(
    () => ({
      close: props.onClose,
    }),
    [props.onClose],
  )

  return (
    <Container
      position={boundedPosition}
      visible={props.visible}
      ref={setContainer}
    >
      <FocusOn
        enabled={props.visible}
        onClickOutside={props.onClose}
        onEscapeKey={props.onClose}
      >
        <Context.Provider value={contextValue}>
          {props.children}
        </Context.Provider>
      </FocusOn>
    </Container>
  )
}

export default ContextMenu

const Context = React.createContext({
  close: () => {},
})

export function useContextMenuContext() {
  return useContext(Context)
}

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
