import React from "react"
import Button from "../dom/Button"
import { ComponentProps } from "../jsx/types"
import { fadedButton } from "../ui/components"
import Icon, { IconProps } from "../ui/Icon"
import { p } from "../ui/style"

type Props = ComponentProps<typeof Button> & {
  icon: IconProps["which"]
}

export default function NavAction({ icon, ...props }: Props) {
  return (
    <Button {...props}>
      <Icon which={icon} size={3} />
    </Button>
  )
}
