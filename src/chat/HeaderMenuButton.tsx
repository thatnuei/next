import React, { ComponentPropsWithoutRef } from "react"
import Button from "../dom/components/Button"
import useMedia from "../dom/hooks/useMedia"
import { fadedButton } from "../ui/components"
import Icon from "../ui/components/Icon"
import { p } from "../ui/helpers.new"
import { chatNavigationBreakpoint } from "./constants"

type Props = ComponentPropsWithoutRef<"button">

function HeaderMenuButton(props: Props) {
  const isLargeScreen = useMedia(`(min-width: ${chatNavigationBreakpoint}px)`)
  return isLargeScreen ? null : (
    <Button css={[fadedButton, p(3)]} {...props}>
      <Icon name="menu" />
    </Button>
  )
}

export default HeaderMenuButton
