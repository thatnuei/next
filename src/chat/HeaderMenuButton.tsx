import React, { ComponentPropsWithoutRef } from "react"
import Button from "../dom/components/Button"
import { fadedButton } from "../ui/components"
import Icon from "../ui/components/Icon"
import { p } from "../ui/helpers.new"

type Props = ComponentPropsWithoutRef<"button">

function HeaderMenuButton(props: Props) {
  return (
    <Button css={[fadedButton, p(3)]} {...props}>
      <Icon name="menu" />
    </Button>
  )
}

export default HeaderMenuButton
