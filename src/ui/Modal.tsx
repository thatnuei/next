import { css } from "@emotion/react"
import { observer } from "mobx-react-lite"
import React, { MouseEvent } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import Portal from "../react/Portal"
import {
  fadedButton,
  headerText,
  raisedPanel,
  raisedPanelHeader,
} from "./components"
import { absoluteCover, fixedCover, transition } from "./helpers"
import Icon from "./Icon"
import { close } from "./icons"

type Props = {
  title: string
  width: number | string
  height: number | string
  isVisible: boolean
  fillMode?: "fullscreen" | "contained"
  verticalPanelAlign?: "top" | "middle"
  children?: React.ReactNode
  onDismiss?: () => void
}

function Modal({
  fillMode = "fullscreen",
  verticalPanelAlign = "middle",
  ...props
}: Props) {
  const handleShadeClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      props.onDismiss?.()
    }
  }

  const shadeStyle = [
    tw`flex flex-col p-4 bg-black-faded`,

    verticalPanelAlign === "top" && tw`items-center justify-start`,
    verticalPanelAlign === "middle" && tw`items-center justify-center`,

    fillMode === "contained" && absoluteCover,
    fillMode === "fullscreen" && fixedCover,

    props.isVisible ? tw`visible opacity-100` : tw`invisible opacity-0`,
    transition,
    tw`transition-all`,
  ]

  const panelStyle = [
    raisedPanel,
    tw`flex flex-col w-full h-full`,
    props.isVisible ? undefined : tw`transform translate-y-4`,
    css({ maxWidth: props.width }),
    css({ maxHeight: props.height }),
    transition,
  ]

  const closeButtonStyle = [
    fadedButton,
    tw`absolute top-0 bottom-0 right-0 flex flex-row justify-center w-16`,
  ]

  const content = (
    <div css={shadeStyle} onPointerDown={handleShadeClick}>
      <div css={panelStyle}>
        <header css={[raisedPanelHeader, tw`relative px-16 text-center`]}>
          <h1 css={headerText}>{props.title}</h1>
          <Button css={closeButtonStyle} onClick={props.onDismiss}>
            <Icon which={close} />
          </Button>
        </header>
        <main css={tw`flex-1 min-h-0`}>{props.children}</main>
      </div>
    </div>
  )

  return fillMode === "fullscreen" ? <Portal>{content}</Portal> : content
}

export default observer(Modal)
