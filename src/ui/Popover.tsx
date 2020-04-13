import { observable } from "mobx"
import { observer } from "mobx-react-lite"
import React, { useState } from "react"
import { FocusOn } from "react-focus-on"
import tw from "twin.macro"
import { useElementSize } from "../dom/useElementSize"
import { useWindowSize } from "../dom/useWindowSize"
import { TagProps } from "../jsx/types"
import Portal from "../react/Portal"
import { OverlayState } from "./OverlayState"

type Props = {
  state: PopoverState
  children: React.ReactNode
} & TagProps<"div">

const edgeSpacing = 12

function Popover({ state, children, ...props }: Props) {
  const [container, setContainer] = useState<HTMLElement | null>()
  const containerSize = useElementSize(container)
  const windowSize = useWindowSize()

  const left = Math.max(
    Math.min(
      state.position.x,
      windowSize.width - containerSize.width - edgeSpacing,
    ),
    edgeSpacing,
  )

  const top = Math.max(
    Math.min(
      state.position.y,
      windowSize.height - containerSize.height - edgeSpacing,
    ),
    edgeSpacing,
  )

  const containerStyle = [
    tw`fixed overflow-y-auto duration-300 shadow-normal bg-background-1`,
    { transitionProperty: "transform, opacity, visibility" },
    state.isVisible
      ? tw`visible transform translate-y-0 opacity-100`
      : tw`invisible transform -translate-y-2 opacity-0`,
    { left, top, maxHeight: `calc(100vh - ${edgeSpacing * 2}px)` },
  ]

  return (
    <Portal>
      <FocusOn
        enabled={state.isVisible}
        onEscapeKey={state.hide}
        onClickOutside={state.hide}
      >
        <div css={containerStyle} {...props} ref={setContainer}>
          {children}
        </div>
      </FocusOn>
    </Portal>
  )
}

export default observer(Popover)

export class PopoverState extends OverlayState {
  @observable.ref
  position = { x: 0, y: 0 }

  showAt = (position: { x: number; y: number }) => {
    this.position = position
    this.show()
  }
}
