import React from "react"
import { fullscreen } from "../helpers"
import { css, styled } from "../styled"

type SidebarOverlayProps = {
  visible?: boolean
  anchor?: "left" | "right"
  children?: React.ReactNode
  onShadeClick?: () => void
}

export default function SideOverlay({
  visible,
  anchor,
  children,
  onShadeClick,
}: SidebarOverlayProps) {
  const handleClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && onShadeClick) {
      onShadeClick()
    }
  }

  return (
    // TODO: add close button
    <Shade visible={visible} onClick={handleClick}>
      <Panel anchor={anchor || "left"} visible={visible}>
        {children}
      </Panel>
    </Shade>
  )
}

const Shade = styled.div<{ visible?: boolean }>`
  z-index: 2;

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
  transition: 0.3s;
  ${(props) => props.anchor}: 0;

  transform: translateX(
    ${(props) => (props.anchor === "left" ? "-100%" : "100%")}
  );
  ${(props) => props.visible && `transform: translateX(0);`}

  > * {
    height: 100%;
  }
`
