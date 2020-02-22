import React from "react"
import { headerText, raisedPanel, raisedPanelHeader } from "./components"
import {
  fixedCover,
  flex1,
  flexCenter,
  flexColumn,
  LengthUnit,
  maxH,
  maxW,
  minH,
  p,
  semiBlackBg,
  size,
} from "./style"

type Props = {
  title: string
  width: LengthUnit
  height: LengthUnit
  children?: React.ReactNode
}

function Modal(props: Props) {
  const panelStyle = [
    raisedPanel,
    size("full"),
    maxW(props.width),
    maxH(props.height),
    flexColumn,
  ]

  return (
    <div css={[fixedCover, semiBlackBg(0.75), flexColumn, flexCenter, p(6)]}>
      <div css={panelStyle}>
        <header css={[raisedPanelHeader]}>
          <h1 css={[headerText]}>{props.title}</h1>
        </header>
        <main css={[flex1, minH(0)]}>{props.children}</main>
      </div>
    </div>
  )
}

export default Modal
