import React, { useContext, useMemo, useState } from "react"
import { FocusOn } from "react-focus-on"
import clamp from "../../common/helpers/clamp"
import useElementSize from "../../dom/hooks/useElementSize"
import useWindowDimensions from "../../dom/hooks/useWindowDimensions"
import {
  bgMidnight,
  fixed,
  hidden,
  shadow,
  transition,
  translateDown,
  visible,
  w,
} from "../helpers.new"
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

  const containerCss = [
    fixed,
    bgMidnight(700),
    w(12),
    shadow,
    transition("opacity, visibility, transform"),
    props.visible ? [visible, translateDown] : [hidden],
  ]

  // put this here so we don't generate a bunch of new css classes for positioning
  const containerStyle = {
    left: boundedPosition.x,
    top: boundedPosition.y,
  }

  return (
    <div css={containerCss} style={containerStyle} ref={setContainer}>
      <FocusOn
        enabled={props.visible}
        onClickOutside={props.onClose}
        onEscapeKey={props.onClose}
      >
        <Context.Provider value={contextValue}>
          {props.children}
        </Context.Provider>
      </FocusOn>
    </div>
  )
}

export default ContextMenu

// TODO: don't use context?
const Context = React.createContext({
  close: () => {},
})

export function useContextMenuContext() {
  return useContext(Context)
}
