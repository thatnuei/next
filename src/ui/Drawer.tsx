import React, { useEffect, useRef } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import * as icons from "../ui/icons"
import { fadedButton } from "./components"
import { fixedCover, transition } from "./helpers"
import Icon from "./Icon"

type Props = {
  children: React.ReactNode
  isVisible: boolean
  onClose: () => void
}

function Drawer(props: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (props.isVisible) {
      closeButtonRef.current?.focus()
    }
  }, [props.isVisible])

  const handleShadeClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      props.onClose()
    }
  }

  const shadeStyle = [
    fixedCover,
    tw`bg-shade`,
    props.isVisible ? tw`visible opacity-100` : tw`invisible opacity-0`,
    transition,
    tw`transition-all`,
  ]

  const contentContainerStyle = [
    tw`absolute top-0 bottom-0 left-0 flex items-start`,
    props.isVisible ? undefined : tw`transform -translate-x-full`,
    transition,
    tw`transition-all`,
  ]

  return (
    <div css={shadeStyle} onClick={handleShadeClick}>
      <div css={contentContainerStyle}>
        <div css={tw`h-full shadow-normal`}>{props.children}</div>
        <Button
          title="close"
          css={[fadedButton, tw`p-2`]}
          onClick={props.onClose}
          ref={closeButtonRef}
        >
          <Icon which={icons.close} />
        </Button>
      </div>
    </div>
  )
}

export default Drawer
