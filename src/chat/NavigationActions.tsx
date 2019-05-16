import React from "react"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import { gapSizes } from "../ui/theme"

export default function NavigationActions() {
  const { overlayStore } = useRootStore()

  return (
    <Box pad={gapSizes.small} background="theme2">
      <Box flex gap={gapSizes.medium}>
        <FadedButton onClick={overlayStore.showChannelBrowser} title="Channels">
          <Icon icon="channels" />
        </FadedButton>

        <FadedButton
          onClick={overlayStore.updateStatus.open}
          title="Update Status"
        >
          <Icon icon="updateStatus" />
        </FadedButton>

        <FadedButton
          onClick={overlayStore.onlineUsers.open}
          title="Who's Online"
        >
          <Icon icon="users" />
        </FadedButton>

        <FadedButton title="About">
          <Icon icon="about" />
        </FadedButton>
      </Box>

      <FadedButton title="Logout">
        <Icon icon="logout" />
      </FadedButton>
    </Box>
  )
}
