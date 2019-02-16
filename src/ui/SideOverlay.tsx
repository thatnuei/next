import React from "react"
import { themeColor } from "./colors"
import { fullscreen } from "./helpers"
import { css, styled } from "./styled"

type SidebarOverlayProps = {
  visible?: boolean
  children?: React.ReactNode
  anchor?: "left" | "right"
  onClick?: () => void
}

export default function SideOverlay(props: SidebarOverlayProps) {
  const { onClick = noop } = props
  return (
    <Shade visible={props.visible} onClick={() => onClick()}>
      <Panel anchor={props.anchor || "left"} visible={props.visible}>
        {props.children}
      </Panel>
    </Shade>
  )
}

const Shade = styled.div<{ visible?: boolean }>`
  z-index: 999;

  ${fullscreen}

  background-color: rgba(0, 0, 0, 0.5);
  transition: 0.3s;

  opacity: 0;
  visibility: hidden;

  ${(props) => props.visible && shadeVisibleStyle}
`

const shadeVisibleStyle = css`
  opacity: 1;
  visibility: visible;
`

const Panel = styled.div<{ anchor: "left" | "right"; visible?: boolean }>`
  position: absolute;
  top: 0;
  bottom: 0;
  width: max-content;
  background-color: ${themeColor};
  transition: 0.3s;
  ${(props) => props.anchor}: 0;

  transform: translateX(
    ${(props) => (props.anchor === "left" ? "-100%" : "100%")}
  );
  ${(props) => props.visible && `transform: translateX(0);`}
`

const noop = () => {}
