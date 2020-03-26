import { css } from "@emotion/react"
import React, { MouseEvent, useEffect, useRef } from "react"
import tw from "twin.macro"
import Button from "../dom/Button"
import {
  fadedButton,
  headerText,
  raisedPanel,
  raisedPanelHeader,
} from "./components"
import { fixedCover } from "./helpers"
import Icon from "./Icon"
import { close } from "./icons"

type Props = {
  title: string
  width: number
  height: number
  isVisible: boolean
  onClose: () => void
  children?: React.ReactNode
}

function Modal(props: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (props.isVisible) {
      closeButtonRef.current?.focus()
    }
  }, [props.isVisible])

  const handleShadeClick = (event: MouseEvent) => {
    if (event.target === event.currentTarget) {
      props.onClose()
    }
  }

  const shadeStyle = [
    tw`flex flex-col items-center justify-center p-4 transition-opacity bg-shade`,
    props.isVisible ? tw`visible opacity-100` : tw`invisible opacity-0`,
    fixedCover,
  ]

  const panelStyle = [
    raisedPanel,
    tw`flex flex-col w-full h-full transition-transform`,
    props.isVisible ? undefined : tw`transform translate-y-1`,
    css({ maxWidth: props.width }),
    css({ maxHeight: props.height }),
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
            onClick={props.onClose}
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

export default Modal
