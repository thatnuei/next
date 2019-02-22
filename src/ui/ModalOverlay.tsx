import React from "react"
import { semiBlack, themeColor } from "./colors"
import { fullscreen } from "./helpers"
import { css } from "./styled"

type ModalOverlayProps = {
  children: React.ReactNode
}

const ModalOverlay = ({ children }: ModalOverlayProps) => {
  return (
    <div css={shade}>
      <div css={panelContainer}>{children}</div>
    </div>
  )
}

export default ModalOverlay

const shade = css`
  ${fullscreen}
  background-color: ${semiBlack(0.5)};
  display: flex;
  flex-flow: column;
  padding: 4rem 0;
  overflow-y: auto;
`

const panelContainer = css`
  margin: auto;
  background-color: ${themeColor};
  width: 100%;
  max-width: max-content;
`
