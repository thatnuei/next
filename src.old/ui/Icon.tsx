import { Icon as MdiIcon } from "@mdi/react"
import React from "react"
import * as icons from "./icons"
import { styled } from "./styled"
import { getIconSize } from "./theme"

export type IconName = keyof typeof icons

export type IconProps = React.ComponentPropsWithoutRef<"div"> & {
  icon: IconName // TODO: rename to "name"
  color?: string
  size?: number
  faded?: boolean
}

const Icon = ({ icon, color, size = 1, faded, ...divProps }: IconProps) => {
  const path = icons[icon]
  const realSize = getIconSize(size)
  return (
    <IconContainer {...divProps} style={{ opacity: faded ? 0.5 : 1 }}>
      <MdiIcon path={path} color={color} size={realSize} />
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
