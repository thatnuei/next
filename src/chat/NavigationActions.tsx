import React from "react"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import { gapSizes } from "../ui/theme"
import StatusOverlay from "./StatusOverlay"

export default function NavigationActions() {
  const { overlayStore } = useRootStore()

  const openStatusForm = () => {
    overlayStore.open(<StatusOverlay />)
  }

  return (
    <Box pad={gapSizes.small} background="theme2">
      <Box flex gap={gapSizes.medium}>
        <FadedButton>
          <Icon icon="channels" />
        </FadedButton>
        <FadedButton onClick={openStatusForm}>
          <Icon icon="updateStatus" />
        </FadedButton>
        <FadedButton>
          <Icon icon="heart" />
        </FadedButton>
        <FadedButton>
          <Icon icon="about" />
        </FadedButton>
      </Box>
      <FadedButton>
        <Icon icon="logout" />
      </FadedButton>
    </Box>
  )
}