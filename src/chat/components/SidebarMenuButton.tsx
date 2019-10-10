import React from "react"
import useMedia from "../../dom/hooks/useMedia"
import FadedButton from "../../ui/components/FadedButton"
import Icon from "../../ui/components/Icon"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import useRootStore from "../../useRootStore"
import { sidebarMenuBreakpoint } from "../constants"

function SidebarMenuButton() {
  const root = useRootStore()
  const isLargeScreen = useMedia(`(min-width: ${sidebarMenuBreakpoint}px)`)

  return isLargeScreen ? null : (
    <StyledFadedButton onClick={root.chatOverlayStore.sidebarMenu.show}>
      <Icon icon="menu" />
    </StyledFadedButton>
  )
}

export default SidebarMenuButton

const StyledFadedButton = styled(FadedButton)`
  padding: ${spacing.small};

  /* this negative margin allows having a larger tap area */
  /* without taking up any additional space, for easier layouts */
  margin: -${spacing.small};
`
