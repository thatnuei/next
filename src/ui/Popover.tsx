import React, { useCallback, useState } from "react"
import { FocusOn } from "react-focus-on"
import tw from "twin.macro"
import { useElementSize } from "../dom/useElementSize"
import { useWindowSize } from "../dom/useWindowSize"
import { TagProps } from "../jsx/types"
import Portal from "../react/Portal"
import { OverlayProps, useOverlay } from "./overlay"

type Props = OverlayProps &
  TagProps<"div"> & {
    position: PopoverPosition
    children: React.ReactNode
  }

type PopoverPosition = { x: number; y: number }

const edgeSpacing = 12

function Popover({
  children,
  position,
  isVisible,
  onDismiss,
  ...props
}: Props) {
  const [container, setContainer] = useState<HTMLElement | null>()
  const containerSize = useElementSize(container)
  const windowSize = useWindowSize()

  const left = Math.max(
    Math.min(position.x, windowSize.width - containerSize.width - edgeSpacing),
    edgeSpacing,
  )

  const top = Math.max(
    Math.min(
      position.y,
      windowSize.height - containerSize.height - edgeSpacing,
    ),
    edgeSpacing,
  )

  const containerStyle = [
    tw`fixed overflow-y-auto duration-300 shadow-normal bg-background-1`,
    { transitionProperty: "transform, opacity, visibility" },
    isVisible
      ? tw`visible transform translate-y-0 opacity-100`
      : tw`invisible transform -translate-y-2 opacity-0`,
    { left, top, maxHeight: `calc(100vh - ${edgeSpacing * 2}px)` },
  ]

  return (
    <Portal>
      <FocusOn
        enabled={isVisible}
        onEscapeKey={onDismiss}
        onClickOutside={onDismiss}
      >
        <div css={containerStyle} {...props} ref={setContainer}>
          {children}
        </div>
      </FocusOn>
    </Portal>
  )
}

export default Popover

export function usePopover() {
  const state = useOverlay()
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const { show } = state
  const showAt = useCallback(
    (position: PopoverPosition) => {
      setPosition(position)
      show()
    },
    [show],
  )

  // TODO: add another callback which accepts an element,
  // then shows the popover at that element's position,
  // possibly accepting a position/alignment option
  // for easier context menus with button triggers

  return { ...state, showAt, props: { ...state.props, position } }
}
