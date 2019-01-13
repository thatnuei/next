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

/* 
export type OverlayAnchor = "center" | "left" | "right"

export type OverlayProps = {
  anchor?: OverlayAnchor
  onShadeClick?: () => void
}

export class Overlay extends React.Component<OverlayProps> {
  render() {
    const { anchor = "center", children } = this.props

    const panels = {
      left: LeftPanel,
      right: RightPanel,
      center: CenterPanel,
    }

    const Panel = panels[anchor]

    return (
      <Shade onClick={this.handleShadeClick}>
        <Panel>{children}</Panel>
      </Shade>
    )
  }

  private handleShadeClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && this.props.onShadeClick) {
      this.props.onShadeClick()
    }
  }
}

const duration = 350

// as unattractive as this is, this gives the best static typing
const Shade = posed(styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background-color: rgba(0, 0, 0, 0.7);

  display: flex;
`)({
  enter: {
    opacity: 1,
    transition: { duration },
  },
  exit: {
    opacity: 0,
    transition: { duration, ease: easeIn },
  },
})

const basePanelStyles = css`
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.7);
`

const enterAnimation = {
  transition: { duration, ease: circOut },
}

const exitAnimation = {
  transition: { duration, ease: easeIn },
}

const CenterPanel = posed(styled.div`
  ${basePanelStyles};
  margin: auto;
  max-width: calc(100vw - 2rem);
  max-height: calc(100vh - 2rem);
`)({
  enter: {
    ...enterAnimation,
    translateY: 0,
  },
  exit: {
    ...exitAnimation,
    translateY: 30,
  },
})

const LeftPanel = posed(styled.div`
  ${basePanelStyles};
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
`)({
  enter: {
    ...enterAnimation,
    translateX: 0,
  },
  exit: {
    ...exitAnimation,
    translateX: "-100%",
  },
})

const RightPanel = posed(styled.div`
  ${basePanelStyles};
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
`)({
  enter: {
    ...enterAnimation,
    translateX: 0,
  },
  exit: {
    ...exitAnimation,
    translateX: "100%",
  },
})
 */
