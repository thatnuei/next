import React, { useState } from "react"
import { FocusOn } from "react-focus-on"
import tw from "twin.macro"
import { useElementSize } from "../dom/useElementSize"
import { useWindowSize } from "../dom/useWindowSize"
import { TagProps } from "../jsx/types"
import Portal from "../react/Portal"

type Props = {
  x: number
  y: number
  children: React.ReactNode
  isVisible: boolean
  onDismiss: () => void
} & TagProps<"div">

const edgeSpacing = 12

function Popover({ children, x, y, isVisible, onDismiss, ...props }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>()
  const containerSize = useElementSize(container)
  const windowSize = useWindowSize()

  const left = Math.max(
    Math.min(x, windowSize.width - containerSize.width - edgeSpacing),
    edgeSpacing,
  )

  const top = Math.max(
    Math.min(y, windowSize.height - containerSize.height - edgeSpacing),
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
  const [isVisible, setVisible] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  return {
    ...position,
    setPosition,
    isVisible,
    setVisible,
    onDismiss: () => setVisible(false),
  }
}
