import React from "react"
import { ToggleState } from "../state/ToggleState"
import { css, styled } from "./styled"

export type OverlayAnchor = "center" | "left" | "right"

export type OverlayProps = {
  anchor?: OverlayAnchor
  onShadeClick?: () => void
  visible?: boolean
}

export class Overlay extends React.Component<OverlayProps> {
  render() {
    const { anchor = "center", children, visible = true } = this.props
    return (
      <Shade onClick={this.handleShadeClick} visible={visible}>
        <Panel anchor={anchor} visible={visible}>
          {children}
        </Panel>
      </Shade>
    )
  }

  private handleShadeClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget && this.props.onShadeClick) {
      this.props.onShadeClick()
    }
  }
}

const Shade = styled.div<{ visible: boolean }>`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  background-color: rgba(0, 0, 0, 0.7);

  display: flex;

  transition: 0.3s;
  ${(props) => (props.visible ? visibleStyle : hiddenStyle)};
`

const visibleStyle = css`
  opacity: 1;
  visibility: visible;
`

const hiddenStyle = css`
  opacity: 0;
  visibility: hidden;
`

type PanelProps = { anchor: OverlayAnchor; visible: boolean }

const Panel = styled.div<PanelProps>`
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.7);
  ${(props) => panelAnchorStyles[props.anchor](props)};
`

const panelAnchorStyles = {
  center: (props: PanelProps) => css`
    margin: auto;
    max-width: calc(100vw - 2rem);
    max-height: calc(100vh - 2rem);
    overflow-y: auto;

    transition: 0.3s transform;
    transform: translateY(${props.visible ? "0" : "-50px"});
  `,
  left: (props: PanelProps) => css`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;

    transition: 0.3s transform;
    transform: translateX(${props.visible ? "0" : "-100%"});
  `,
  right: (props: PanelProps) => css`
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;

    transition: 0.3s transform;
    transform: translateX(${props.visible ? "0" : "100%"});
  `,
}

export function toggleStateProps(ts: ToggleState): OverlayProps {
  return { visible: ts.enabled, onShadeClick: ts.disable }
}
