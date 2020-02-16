import React from "react"
import Button from "../dom/Button"
import { fadedButton } from "../ui/components"
import Icon, { IconName } from "../ui/Icon"
import { p } from "../ui/style"

type Props = {
  icon: IconName
  title: string
  onClick?: () => void
}

export default function NavAction(props: Props) {
  return (
    <Button
      css={[fadedButton, p(3)]}
      title={props.title}
      onClick={props.onClick}
    >
      <Icon name={props.icon} size={3} />
    </Button>
  )
}
