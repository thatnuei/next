import React, { MouseEvent, useEffect, useRef } from "react"
import Button from "../dom/Button"
import {
  fadedButton,
  headerText,
  raisedPanel,
  raisedPanelHeader,
} from "./components"
import Icon from "./Icon"
import { close } from "./icons"
import {
  absolute,
  bottom,
  css,
  fixedCover,
  flex1,
  flexCenter,
  flexColumn,
  flexRow,
  invisible,
  justifyContent,
  LengthUnit,
  maxH,
  maxW,
  minH,
  opacity,
  p,
  px,
  relative,
  right,
  semiBlackBg,
  size,
  textCenter,
  top,
  transition,
  visible,
  w,
} from "./style"

type Props = {
  title: string
  width: LengthUnit
  height: LengthUnit
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
    fixedCover,
    semiBlackBg(0.75),
    flexColumn,
    flexCenter,
    p(4),
    props.isVisible ? [opacity(1), visible] : [opacity(0), invisible],
    transition("opacity, visibility"),
  ]

  const panelStyle = [
    raisedPanel,
    size("full"),
    maxW(props.width),
    maxH(props.height),
    flexColumn,
    props.isVisible ? undefined : transformSlideDown,
    transition("transform"),
  ]

  const closeButtonStyle = [
    fadedButton,
    absolute,
    top(0),
    bottom(0),
    right(0),
    w(16),
    flexRow,
    justifyContent("center"),
  ]

  return (
    <div onPointerDown={handleShadeClick}>
      <div>
        <header>
          <h1>{props.title}</h1>
          <Button onClick={props.onClose} ref={closeButtonRef}>
            <Icon which={close} />
          </Button>
        </header>
        <main>{props.children}</main>
      </div>
    </div>
  );
}

export default Modal

const transformSlideDown = css({
  transform: `translateY(20px)`,
})
