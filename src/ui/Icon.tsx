import { Icon as MdiIcon } from "@mdi/react"
import React from "react"
import * as icons from "./icons"
import { styled } from "./styled"

type IconProps = React.ComponentPropsWithoutRef<"div"> & {
  icon: keyof typeof icons // TODO: rename to "name"
  color?: string
  size?: number
}

const Icon = ({ icon, color, size = 1, ...divProps }: IconProps) => {
  const path = icons[icon]
  return (
    <IconContainer {...divProps}>
      <MdiIcon path={path} color={color} size={size} />
    </IconContainer>
  )
}

export default Icon

export const IconContainer = styled.div`
  line-height: 1;
  svg {
    vertical-align: top;
    fill: currentColor;
  }
`
