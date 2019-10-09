import React from "react"
import FadedButton from "../../ui/components/FadedButton"
import Icon from "../../ui/components/Icon"
import { styled } from "../../ui/styled"
import { spacing } from "../../ui/theme"
import useRootStore from "../../useRootStore"
import { sidebarMenuBreakpoint } from "../constants"

type Props = {}

function SidebarMenuButton(props: Props) {
  const root = useRootStore()
  return (
    <StyledFadedButton onClick={root.chatNavigationStore.sidebarMenu.show}>
      <Icon icon="menu" />
    </StyledFadedButton>
  )
}

export default SidebarMenuButton

const StyledFadedButton = styled(FadedButton)`
  padding: ${spacing.small};

  @media (min-width: ${sidebarMenuBreakpoint}px) {
    display: none;
  }
`