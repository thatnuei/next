import React from "react"
import { FocusOn } from "react-focus-on"
import { focusOnFillFix, raisedPanel } from "../components"
import {
  absolute,
  absoluteCover,
  bgSemiBlack,
  fixed,
  flex,
  flex1,
  h,
  hidden,
  m,
  opacity,
  p,
  transition,
  translateDown,
  visible,
  w,
} from "../helpers.new"
import FadedButton from "./FadedButton"
import Icon from "./Icon"
import RaisedPanelHeader from "./RaisedPanelHeader"

type Props = {
  title: string
  visible: boolean
  panelWidth?: number
  panelHeight?: number
  children: React.ReactNode
  onClose?: () => void

  /**
   * full: will fill the entire screen
   * contained: will fill the area of the element it's inside of (element needs to have position: relative)
   */
  fillMode?: FillMode
}

type FillMode = "full" | "contained"

function Modal({
  panelWidth = 300,
  panelHeight = 400,
  fillMode = "full",
  ...props
}: Props) {
  const closeButton = (
    <FadedButton onClick={props.onClose}>
      <Icon name="close" />
    </FadedButton>
  )

  const modalPanelStyle = {
    maxWidth: panelWidth,
    maxHeight: panelHeight,
  }

  return (
    <div css={shadeCss(props)}>
      <div css={modalPanelCss(props)} style={modalPanelStyle}>
        <FocusOn
          enabled={props.visible}
          onEscapeKey={props.onClose}
          onClickOutside={props.onClose}
        >
          <RaisedPanelHeader
            center={<h2>{props.title}</h2>}
            right={closeButton}
          />
          <div css={[flex1, { minHeight: 0 }]}>{props.children}</div>
        </FocusOn>
      </div>
    </div>
  )
}

export default Modal

const shadeCss = (props: Props) => [
  absoluteCover,
  bgSemiBlack(50),
  transition("opacity, visibility"),
  p(3),
  props.fillMode === "full" ? fixed : absolute,
  props.visible ? [opacity(100), visible] : [opacity(0), hidden],
  flex("column"),
]

const modalPanelCss = (props: Props) => [
  raisedPanel,
  flex1,
  w("full"),
  h("full"),
  transition("transform"),
  m("auto"),
  props.visible ? {} : translateDown,
  focusOnFillFix,
]
