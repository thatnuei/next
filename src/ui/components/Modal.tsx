import React from "react"
import { FocusOn } from "react-focus-on"
import { flexCenter, flexGrow, fullscreen, resolveStyleUnit } from "../helpers"
import { styled } from "../styled"
import { getThemeColor, shadows, spacing } from "../theme"
import FadedButton from "./FadedButton"
import Icon from "./Icon"

type Props = {
  title: string
  visible?: boolean
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
  visible = false,
  panelWidth = 300,
  panelHeight = 400,
  fillMode = "full",
  ...props
}: Props) {
  return (
    <Shade visible={visible} fillMode={fillMode}>
      <Panel visible={visible} maxWidth={panelWidth} maxHeight={panelHeight}>
        <FocusOn
          enabled={visible}
          onEscapeKey={props.onClose}
          onClickOutside={props.onClose}
        >
          <Header>
            <HeaderSlot />
            <HeaderText>{props.title}</HeaderText>
            <HeaderSlot>
              <FadedButton onClick={props.onClose}>
                <Icon icon="close" />
              </FadedButton>
            </HeaderSlot>
          </Header>
          <PanelBody>{props.children}</PanelBody>
        </FocusOn>
      </Panel>
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

  ${(props) =>
    props.visible
      ? { opacity: 1, visibility: "visible" }
      : { opacity: 0, visibility: "hidden" }}
`

type PanelProps = { visible: boolean; maxWidth: number; maxHeight: number }

const Panel = styled.div<PanelProps>`
  margin: auto;
  box-shadow: ${shadows.normal};
  background-color: ${getThemeColor("theme0")};
  transition: 0.3s transform;

  width: 100%;
  height: 100%;
  max-width: ${(props) => resolveStyleUnit(props.maxWidth)};
  max-height: ${(props) => resolveStyleUnit(props.maxHeight)};

  ${(props) =>
    props.visible
      ? { transform: `translateY(0)` }
      : { transform: `translateY(20px)` }}

  /* content-size the FocusOn div, which can't be styled directly */
  > div {
    width: 100%;
    height: 100%;
  }

  > div > div {
    width: 100%;
    height: 100%;

    display: flex;
    flex-direction: column;
  }
`

const PanelBody = styled.div`
  ${flexGrow};
`

const Header = styled.div`
  background-color: ${getThemeColor("theme1")};
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const HeaderText = styled.h2``

const HeaderSlot = styled.div`
  width: 50px;
  height: 50px;
  ${flexCenter};
`
