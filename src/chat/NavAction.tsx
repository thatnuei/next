import React from "react"
import Button from "../dom/Button"
import { ComponentProps } from "../jsx/types"
import { fadedButton } from "../ui/components"
import Icon, { IconName } from "../ui/Icon"
import { p } from "../ui/style"

type Props = ComponentProps<typeof Button> & {
  icon: IconName
}

export default function NavAction({ icon, ...props }: Props) {
  return (
    <Button css={[fadedButton, p(3)]} {...props}>
      <Icon name={icon} size={3} />
    </Button>
  )
}