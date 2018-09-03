import React from "react"
import { css, styled } from "./styled"

export type OverlayAnchor = "center" | "left" | "right"

export type OverlayProps = {
  anchor?: OverlayAnchor
  onShadeClick?: () => void
}

export class Overlay extends React.Component<OverlayProps> {
  render() {
    const { anchor = "center" } = this.props
    return (
      <Shade onClick={this.handleShadeClick}>
        <Panel anchor={anchor}>{this.props.children}</Panel>
      </Shade>
    )
  }

  private handleShadeClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && this.props.onShadeClick) {
      this.props.onShadeClick()
    }
  }
}

const Shade = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background-color: rgba(0, 0, 0, 0.5);

  display: flex;
`

const Panel = styled.div<{ anchor: OverlayAnchor }>`
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  ${(props) => anchorStyles[props.anchor]};
`

const anchorStyles = {
  center: css`
    margin: auto;
    max-width: calc(100vw - 2rem);
  `,
  left: css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
  `,
  right: css`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
  `,
}
