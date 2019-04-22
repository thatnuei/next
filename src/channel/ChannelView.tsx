import { Box, Heading, Text } from "grommet"
import { observer } from "mobx-react-lite"
import React, { useContext } from "react"
import Chatbox from "../chat/Chatbox"
import { NavigationOverlayContext } from "../chat/ChatScreen"
import MessageList from "../message/MessageList"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { ThemeColor } from "../ui/theme"
import useMedia from "../ui/useMedia"
import useToggleState from "../ui/useToggleState"
import ChannelModel from "./ChannelModel"
import ChannelUserList from "./ChannelUserList"

const userListBreakpoint = 1200

type Props = { channel: ChannelModel }

function ChannelView({ channel }: Props) {
  const userListVisible = useMedia(`(min-width: ${userListBreakpoint}px)`)
  const descriptionUi = useToggleState()
  const userListOverlay = useToggleState()
  const navOverlayContext = useContext(NavigationOverlayContext)

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
      overflow={{ vertical: "auto" }}
      background={ThemeColor.bgDark}
      style={{
        position: "absolute",
        top: "100%",
        zIndex: 1,
        maxHeight: "50vh",
      }}
    >
      <Text
        style={{ whiteSpace: "pre-line" }}
        dangerouslySetInnerHTML={{ __html: channel.description }}
      />
    </Box>
  )

  const channelHeader = (
    <Box background={ThemeColor.bg} style={{ position: "relative" }}>
      <Box pad="small" gap="small" direction="row" align="center">
        <Box direction="row" align="center" gap="xsmall" flex>
          {navOverlayContext.isOverlayVisible && (
            <FadedButton onClick={navOverlayContext.show}>
              <Icon icon="menu" />
            </FadedButton>
          )}

          <Box direction="row" gap="xsmall" align="center">
            <Heading level="3">{channel.name}</Heading>

            <FadedButton onClick={descriptionUi.toggle}>
              <Icon icon="about" />
            </FadedButton>
          </Box>
        </Box>

        {channelFilters}

        {!userListVisible && (
          <FadedButton onClick={userListOverlay.enable}>
            <Icon icon="users" />
          </FadedButton>
        )}
      </Box>

      {descriptionUi.on && channelDescription}
    </Box>
  )

  return (
    <>
      <Box as="main" flex gap="xsmall">
        {/* room content */}
        <Box direction="row" flex gap="xsmall">
          <Box flex>
            {channelHeader}

            <Box flex background={ThemeColor.bgDark}>
              <MessageList messages={channel.messages} />
            </Box>
          </Box>

          {userListVisible && <ChannelUserList channel={channel} />}
        </Box>

        {/* chatbox */}
        <Box background={ThemeColor.bg} pad="xsmall">
          <Chatbox onSubmit={console.log} />
        </Box>
      </Box>

      {!userListVisible && (
        <SideOverlay
          anchor="right"
          visible={userListOverlay.on}
          onClick={userListOverlay.disable}
        >
          <Box elevation="large" onClick={(e) => e.stopPropagation()}>
            <ChannelUserList channel={channel} />
          </Box>
        </SideOverlay>
      )}
    </>
  )
}
export default observer(ChannelView)
