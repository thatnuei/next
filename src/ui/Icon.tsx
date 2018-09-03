import { Icon as MdiIcon } from "@mdi/react"
import React from "react"
import { clouds } from "./colors"
import { styled } from "./styled"

type Props = {
  path: string
  color?: string
  size?: number
}

export class Icon extends React.Component<Props> {
  render() {
    const { path, color = clouds, size = 1 } = this.props
    return (
      <IconContainer>
        <MdiIcon path={path} color={color} size={size} />
      </IconContainer>
    )
  }
}

export const IconContainer = styled.div`
  svg {
    vertical-align: top;
  }
`
