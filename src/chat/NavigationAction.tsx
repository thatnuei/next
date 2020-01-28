import React from "react"
import Button from "../dom/components/Button"
import { fadedButton } from "../ui/components"
import Icon, { IconName } from "../ui/components/Icon"
import { p } from "../ui/helpers.new"

type Props = {
  title: string
  icon: IconName
  onClick?: () => void
}

function NavigationAction({ title, icon, onClick }: Props) {
  return (
    <Button css={[fadedButton, p(3)]} title={title} onClick={onClick}>
      <Icon name={icon} />
    </Button>
  )
}

export default NavigationAction
