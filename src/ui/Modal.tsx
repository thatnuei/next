import { css } from "@emotion/react"
import { observer } from "mobx-react-lite"
import React, { MouseEvent, useEffect, useRef } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import {
  fadedButton,
  headerText,
  raisedPanel,
  raisedPanelHeader,
} from "./components"
import { absoluteCover, fixedCover, transition } from "./helpers"
import Icon from "./Icon"
import { close } from "./icons"
import { OverlayModel } from "./OverlayModel"

type Props = {
  title: string
  width: number | string
  height: number | string
  model: OverlayModel
  fillMode?: "fixed" | "absolute"
  verticalPanelAlign?: "top" | "middle"
  children?: React.ReactNode
}

function Modal({
  fillMode = "fixed",
  verticalPanelAlign = "middle",
  ...props
}: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (props.model.isVisible) {
      closeButtonRef.current?.focus()
    }
  }, [props.model.isVisible])

  const handleShadeClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      props.model.hide()
    }
  }

  const shadeStyle = [
    tw`flex flex-col p-4 bg-black-faded`,

    verticalPanelAlign === "top" && tw`items-center justify-start`,
    verticalPanelAlign === "middle" && tw`items-center justify-center`,

    fillMode === "absolute" && absoluteCover,
    fillMode === "fixed" && fixedCover,

    props.model.isVisible ? tw`visible opacity-100` : tw`invisible opacity-0`,
    transition,
    tw`transition-all`,
  ]

  const panelStyle = [
    raisedPanel,
    tw`flex flex-col w-full h-full`,
    props.model.isVisible ? undefined : tw`transform translate-y-4`,
    css({ maxWidth: props.width }),
    css({ maxHeight: props.height }),
    transition,
  ]

  const closeButtonStyle = [
    fadedButton,
    tw`absolute top-0 bottom-0 right-0 flex flex-row justify-center w-16`,
  ]

  return (
    <div css={shadeStyle} onPointerDown={handleShadeClick}>
      <div css={panelStyle}>
        <header css={[raisedPanelHeader, tw`relative px-16 text-center`]}>
          <h1 css={headerText}>{props.title}</h1>
          <Button
            css={closeButtonStyle}
            onClick={props.model.hide}
            ref={closeButtonRef}
          >
            <Icon which={close} />
          </Button>
        </header>
        <main css={tw`flex-1 min-h-0`}>{props.children}</main>
      </div>
    </div>
  )
}

export default observer(Modal)
