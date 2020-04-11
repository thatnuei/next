import { observer } from "mobx-react-lite"
import React, { useRef } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import * as icons from "../ui/icons"
import { fadedButton } from "./components"
import { fixedCover, transition } from "./helpers"
import Icon from "./Icon"
import { OverlayModel } from "./OverlayModel"

type Props = {
  model: OverlayModel
  side: "left" | "right"
  children: React.ReactNode
}

function Drawer({ model, side, children }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  const handleShadeClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      model.hide()
    }
  }

  const shadeStyle = [
    fixedCover,
    tw`bg-black-faded`,
    model.isVisible ? tw`visible opacity-100` : tw`invisible opacity-0`,
    transition,
    tw`transition-all`,
  ]

  const contentContainerStyle = [
    tw`absolute flex items-start transition-all duration-300`,
    side === "left" && [
      tw`top-0 bottom-0 left-0`,
      model.isVisible ? undefined : tw`transform -translate-x-full`,
    ],
    side === "right" && [
      tw`top-0 bottom-0 right-0`,
      model.isVisible ? undefined : tw`transform translate-x-full`,
    ],
  ]

  const closeButton = (
    <Button
      title="close"
      css={[fadedButton, tw`p-2`]}
      onClick={model.hide}
      ref={closeButtonRef}
    >
      <Icon which={icons.close} />
    </Button>
  )

  return (
    <div css={shadeStyle} onClick={handleShadeClick}>
      <div css={contentContainerStyle}>
        {side === "right" && closeButton}
        <div css={tw`h-full shadow-normal`}>{children}</div>
        {side === "left" && closeButton}
      </div>
    </div>
  )
}

export default observer(Drawer)
