import React from "react"
import ChatMenuButton from "../chat/ChatMenuButton"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import ChannelFilters from "./ChannelFilters"
import ChannelModel from "./ChannelModel"

type Props = {
  channel: ChannelModel
  userListButton: React.ReactNode
  onToggleDescription: () => void
}

function ChannelHeader(props: Props) {
  return (
    <Box background="theme0">
      <Box
        pad={spacing.small}
        gap={spacing.small}
        direction="row"
        align="center"
      >
        <Box direction="row" align="center" gap={spacing.xsmall} flex>
          <ChatMenuButton />

          <Box
            as={ChannelTitleButton}
            direction="row"
            gap={spacing.xsmall}
            align="center"
            onClick={props.onToggleDescription}
          >
            <h3>{props.channel.name}</h3>
            <Icon icon="about" style={{ opacity: 0.5 }} />
          </Box>
        </Box>

        <ChannelFilters channel={props.channel} />

        {props.userListButton}
      </Box>
    </Box>
  )
}

export default ChannelHeader

const ChannelTitleButton = styled(FadedButton)`
  opacity: 0.7;

  :hover {
    opacity: 1;
  }
`
