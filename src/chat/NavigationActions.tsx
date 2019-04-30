import React from "react"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import { gapSizes } from "../ui/theme"

type Props = {
  onChannels?: () => void
  onUpdateStatus?: () => void
  onFriends?: () => void
  onAbout?: () => void
  onLogout?: () => void
}

export default function NavigationActions(props: Props) {
  return (
    <Box pad={gapSizes.small} background="theme2">
      <Box flex gap={gapSizes.medium}>
        <FadedButton onClick={props.onChannels}>
          <Icon icon="channels" />
        </FadedButton>
        <FadedButton onClick={props.onUpdateStatus}>
          <Icon icon="updateStatus" />
        </FadedButton>
        <FadedButton onClick={props.onFriends}>
          <Icon icon="heart" />
        </FadedButton>
        <FadedButton onClick={props.onAbout}>
          <Icon icon="about" />
        </FadedButton>
      </Box>
      <FadedButton onClick={props.onLogout}>
        <Icon icon="logout" />
      </FadedButton>
    </Box>
  )
}
