import React from "react"
import { fullscreen } from "./helpers"
import { css } from "./styled"

type SidebarOverlayProps = {
  visible?: boolean
  children?: React.ReactNode
  anchor?: "left" | "right"
  onClick?: () => void
}

export default function SideOverlay(props: SidebarOverlayProps) {
  const { onClick = noop } = props
  return (
    <div onClick={() => onClick()} css={shadeStyle(props)}>
      <div css={panelStyle(props)}>{props.children}</div>
    </div>
  )
}

const shadeStyle = (props: SidebarOverlayProps) => css`
  ${fullscreen}

  background-color: rgba(0, 0, 0, 0.5);
  transition: 0.3s;

  ${props.visible
    ? css`
        opacity: 1;
        visibility: visible;
      `
    : css`
        opacity: 0;
        visibility: hidden;
      `}
`

const panelStyle = ({ anchor = "left", ...props }: SidebarOverlayProps) => css`
  position: absolute;
  top: 0;
  bottom: 0;
  width: max-content;
  transition: 0.3s;

  ${anchor}: 0;

  ${props.visible
    ? css`
        transform: translateX(0);
      `
    : css`
        transform: translateX(${anchor === "left" ? "-100%" : "100%"});
      `}
`

const noop = () => {}
