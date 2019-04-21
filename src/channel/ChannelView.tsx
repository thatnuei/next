import { Box, Heading, Text } from "grommet"
import React from "react"
import CharacterName from "../character/CharacterName"
import Chatbox from "../chat/Chatbox"
import MessageList from "../message/MessageList"
import Icon from "../ui/Icon"
import { ThemeColor } from "../ui/theme"
import ChannelModel from "./ChannelModel"

type Props = { channel: ChannelModel }

export default function ChannelView({ channel }: Props) {
  const channelHeader = (
    <Box direction="row" align="center" gap="xsmall" flex>
      <Heading level="3">{channel.name}</Heading>
      <Icon icon="about" size={1} style={{ opacity: 0.5 }} />
    </Box>
  )

  const channelFilters = (
    <Box direction="row" gap="small">
      <Text size="normal" style={{ opacity: 0.5 }}>
        Both
      </Text>
      <Text size="normal">Chat</Text>
      <Text size="normal" style={{ opacity: 0.5 }}>
        Ads
      </Text>
    </Box>
  )

  const channelDescription = (
    <Box
      pad="small"
      height="small"
      overflow={{ vertical: "auto" }}
      background={ThemeColor.bgShaded}
    >
      <Text
        size="small"
        style={{ whiteSpace: "pre-line" }}
        dangerouslySetInnerHTML={{ __html: channel.description }}
      />
    </Box>
  )

  const userList = (
    <Box width="small">
      <Box background={ThemeColor.bg} pad="xsmall">
        Characters: 420
      </Box>

      <Box
        pad="xsmall"
        gap="xxsmall"
        flex
        overflow={{ vertical: "auto" }}
        background={ThemeColor.bgDark}
      >
        <CharacterName name="Subaru-chan" gender="Female" status="online" />
        <CharacterName
          name="Subaru-chan"
          gender="Transgender"
          status="online"
        />
        <CharacterName name="Subaru-chan" gender="None" status="online" />
        <CharacterName name="Subaru-chan" gender="Cunt-boy" status="online" />
        <CharacterName name="Subaru-chan" gender="Male" status="online" />
        <CharacterName name="Subaru-chan" gender="Male-Herm" status="online" />
        <CharacterName name="Subaru-chan" gender="Shemale" status="online" />
        <CharacterName name="Subaru-chan" gender="Herm" status="online" />
      </Box>
    </Box>
  )

  return (
    <Box as="main" flex gap="xsmall">
      {/* room content */}
      <Box direction="row" flex gap="xsmall">
        <Box flex>
          <Box background={ThemeColor.bg}>
            <Box pad="small" direction="row" align="center">
              {channelHeader}
              {channelFilters}
            </Box>

            {channelDescription}
          </Box>

          <Box
            flex
            background={ThemeColor.bgDark}
            overflow={{ vertical: "auto" }}
          >
            <MessageList messages={channel.messages} />
          </Box>
        </Box>

        {userList}
      </Box>

      {/* chatbox */}
      <Box background={ThemeColor.bg} pad="xsmall">
        <Chatbox onSubmit={console.log} />
      </Box>
    </Box>
  )
}
