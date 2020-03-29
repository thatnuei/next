import { observer } from "mobx-react-lite"
import React, { useEffect, useRef } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import * as icons from "../ui/icons"
import { fadedButton } from "./components"
import { fixedCover, transition } from "./helpers"
import Icon from "./Icon"
import { OverlayModel } from "./OverlayModel"

type Props = {
  model: OverlayModel
  children: React.ReactNode
}

function Drawer({ model, children }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (model.isVisible) {
      closeButtonRef.current?.focus()
    }
  }, [model.isVisible])

  const handleShadeClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      model.hide()
    }
  }

  const shadeStyle = [
    fixedCover,
    tw`bg-shade`,
    model.isVisible ? tw`visible opacity-100` : tw`invisible opacity-0`,
    transition,
    tw`transition-all`,
  ]

  const contentContainerStyle = [
    tw`absolute top-0 bottom-0 left-0 flex items-start`,
    model.isVisible ? undefined : tw`transform -translate-x-full`,
    transition,
    tw`transition-all`,
  ]

  return (
    <div css={shadeStyle} onClick={handleShadeClick}>
      <div css={contentContainerStyle}>
        <div css={tw`h-full shadow-normal`}>{children}</div>
        <Button
          title="close"
          css={[fadedButton, tw`p-2`]}
          onClick={model.hide}
          ref={closeButtonRef}
        >
          <Icon which={icons.close} />
        </Button>
      </div>
    </div>
  )
}

export default observer(Drawer)
