import { Icon as MdiIcon } from "@mdi/react"
import React from "react"
import { clouds } from "./colors"
import * as icons from "./icons"
import { styled } from "./styled"

type IconProps = {
  icon: keyof typeof icons
  color?: string
  size?: number
}

const Icon = ({ icon, color = clouds, size = 1 }: IconProps) => {
  const path = icons[icon]
  return (
    <IconContainer>
      <MdiIcon path={path} color={color} size={size} />
    </IconContainer>
  )
}

export default Icon

export const IconContainer = styled.div`
  line-height: 1;
  svg {
    vertical-align: top;
  }
`
