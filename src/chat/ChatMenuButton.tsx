import React from "react"
import { useRootStore } from "../RootStore"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import useChatNavBreakpoint from "./useChatNavBreakpoint"

export default function ChatMenuButton() {
  const { overlayStore } = useRootStore()
  const isChatNavVisible = useChatNavBreakpoint()

  return isChatNavVisible ? null : (
    <FadedButton onClick={overlayStore.chatNav.open}>
      <Icon icon="menu" />
    </FadedButton>
  )
}
