import React from "react"
import Button from "../dom/Button"
import { ComponentProps } from "../jsx/types"
import { fadedButton } from "../ui/components"
import Icon, { IconProps } from "../ui/Icon"
import { p, themeBgColor } from "../ui/style"

type Props = ComponentProps<typeof Button> & {
  icon: IconProps["which"]
  isActive?: boolean
}

export default function NavAction({ icon, isActive, ...props }: Props) {
  return (
    <div css={[isActive && themeBgColor(0)]}>
      <Button css={[fadedButton, p(3)]} {...props}>
        <Icon which={icon} size={3} />
      </Button>
    </div>
  )
}
