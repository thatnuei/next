import React from "react"
import { FocusOn } from "react-focus-on"
import { flexCenter, fullscreen } from "../helpers"
import { styled } from "../styled"
import { getThemeColor, shadows } from "../theme"
import FadedButton from "./FadedButton"
import Icon from "./Icon"

type Props = {
  visible?: boolean
  children: React.ReactNode
  title: string
  onClose?: () => void

  /**
   * full: will fill the entire screen
   * contained: will fill the area of the element it's inside of (element needs to have position: relative)
   */
  fillMode?: FillMode
}

type FillMode = "full" | "contained"

function Modal({ visible = false, ...props }: Props) {
  return (
    <Shade visible={visible} fillMode={props.fillMode}>
      <Panel visible={visible}>
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

          {props.children}
        </FocusOn>
      </Panel>
    </Shade>
  )
}

export default Modal

const Shade = styled.div<{ visible?: boolean; fillMode?: FillMode }>`
  ${fullscreen};

  background-color: rgba(0, 0, 0, 0.5);
  transition: 0.3s;

  display: flex;
  flex-direction: column;

  ${({ fillMode = "full" }) =>
    fillMode === "full" ? { position: "fixed" } : { position: "absolute" }};

  ${(props) =>
    props.visible
      ? { opacity: 1, visibility: "visible" }
      : { opacity: 0, visibility: "hidden" }}
`

const Panel = styled.div<{ visible?: boolean }>`
  margin: auto;
  box-shadow: ${shadows.normal};
  background-color: ${getThemeColor("theme0")};
  transition: 0.3s transform;

  ${(props) =>
    props.visible
      ? { transform: `translateY(0)` }
      : { transform: `translateY(20px)` }}
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
