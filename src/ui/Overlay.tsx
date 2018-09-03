import React from "react"
import { flist3 } from "./colors"
import { styled } from "./styled"

export type OverlayProps = {}

export class Overlay extends React.Component<OverlayProps> {
  render() {
    return (
      <Shade>
        <Panel>{this.props.children}</Panel>
      </Shade>
    )
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

const Panel = styled.div<OverlayProps>`
  background-color: ${flist3};
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.5);
  max-width: calc(100vw - 2rem);
  margin: auto;
`
