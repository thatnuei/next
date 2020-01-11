import React, { ComponentPropsWithoutRef } from "react"
import useMedia from "../../dom/hooks/useMedia"
import FadedButton from "../../ui/components/FadedButton"
import Icon from "../../ui/components/Icon"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import { chatNavigationBreakpoint } from "../constants"

type Props = ComponentPropsWithoutRef<typeof FadedButton>

function HeaderMenuButton(props: Props) {
  const isLargeScreen = useMedia(`(min-width: ${chatNavigationBreakpoint}px)`)
  return isLargeScreen ? null : (
    <StyledFadedButton {...props}>
      <Icon name="menu" />
    </StyledFadedButton>
  )
}

export default HeaderMenuButton

const StyledFadedButton = styled(FadedButton)`
  padding: ${spacing.small};

  /* this negative margin allows having a larger tap area */
  /* without taking up any additional space, for easier layouts */
  margin: -${spacing.small};
`
