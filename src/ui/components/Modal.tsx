import React from "react"
import { FocusOn } from "react-focus-on"
import { flexGrow, focusOnFillFix, fullscreen, resolveStyleUnit } from "../helpers"
import { styled } from "../styled"
import { spacing } from "../theme"
import FadedButton from "./FadedButton"
import Icon from "./Icon"
import RaisedPanelHeader from "./RaisedPanelHeader"
import RaisedPanel from "./RaisedPanel"

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

function Modal({ panelWidth = 300, panelHeight = 400, fillMode = "full", ...props }: Props) {
  const closeButton = (
    <FadedButton onClick={props.onClose}>
      <Icon icon="close" />
    </FadedButton>
  )

  return (
    <Shade visible={props.visible} fillMode={fillMode}>
      <ModalPanel visible={props.visible} maxWidth={panelWidth} maxHeight={panelHeight}>
        <FocusOn enabled={props.visible} onEscapeKey={props.onClose} onClickOutside={props.onClose}>
          <RaisedPanelHeader
            center={<h2>{props.title}</h2>}
            right={closeButton}
          />
          <PanelBody>{props.children}</PanelBody>
        </FocusOn>
      </ModalPanel>
    </Shade>
  )
}

export default Modal

type ShadeProps = { visible: boolean; fillMode: FillMode }

const Shade = styled.div<ShadeProps>`
  ${fullscreen};

  background-color: rgba(0, 0, 0, 0.5);
  transition: 0.3s;

  display: flex;
  flex-direction: column;
  padding: ${spacing.small};

  ${({ fillMode }) =>
    fillMode === "full" ? { position: "fixed" } : { position: "absolute" }};

  ${({ visible }) =>
    visible
      ? { opacity: 1, visibility: "visible" }
      : { opacity: 0, visibility: "hidden" }}

  > * {
    margin: auto;
  }
`

type PanelProps = { visible: boolean; maxWidth: number; maxHeight: number }

const ModalPanel = styled(RaisedPanel) <PanelProps>`
  width: 100%;
  height: 100%;
  max-width: ${({ maxWidth }) => resolveStyleUnit(maxWidth)};
  max-height: ${({ maxHeight }) => resolveStyleUnit(maxHeight)};

  transition: 0.3s transform;

  ${({ visible }) =>
    visible
      ? { transform: `translateY(0)` }
      : { transform: `translateY(20px)` }}

  ${focusOnFillFix};
`

const PanelBody = styled.div`
  ${flexGrow};
`
