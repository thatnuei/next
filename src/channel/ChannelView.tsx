import { observer } from "mobx-react-lite"
import React, { useContext } from "react"
import Chatbox from "../chat/Chatbox"
import { NavigationOverlayContext } from "../chat/ChatScreen"
import MessageList from "../message/MessageList"
import BBC from "../ui/BBC"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import SideOverlay from "../ui/SideOverlay"
import { gapSizes } from "../ui/theme"
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
    <Box direction="row" gap={gapSizes.small}>
      <span style={{ opacity: 0.5 }}>Both</span>
      <span>Chat</span>
      <span style={{ opacity: 0.5 }}>Ads</span>
    </Box>
  )

  // TODO: animate this
  const channelDescription = (
    <Box
      pad={gapSizes.small}
      overflow={{ vertical: "auto" }}
      background="theme1"
      style={{
        position: "absolute",
        top: "100%",
        zIndex: 1,
        maxHeight: "50vh",
      }}
    >
      <BBC text={channel.description} />
    </Box>
  )

  const channelHeader = (
    <Box background="theme0" style={{ position: "relative" }}>
      <Box
        pad={gapSizes.small}
        gap={gapSizes.small}
        direction="row"
        align="center"
      >
        <Box direction="row" align="center" gap={gapSizes.xsmall} flex>
          {navOverlayContext.isOverlayVisible && (
            <FadedButton onClick={navOverlayContext.show}>
              <Icon icon="menu" />
            </FadedButton>
          )}

          <Box direction="row" gap={gapSizes.xsmall} align="center">
            <h3>{channel.name}</h3>

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
      <Box as="main" flex gap={gapSizes.xsmall}>
        {/* room content */}
        <Box direction="row" flex gap={gapSizes.xsmall}>
          <Box flex>
            {channelHeader}

            <Box flex background="theme1">
              <MessageList messages={channel.messages} />
            </Box>
          </Box>

          {userListVisible && <ChannelUserList channel={channel} />}
        </Box>

        {/* chatbox */}
        <Box background="theme0" pad={gapSizes.xsmall}>
          <Chatbox onSubmit={console.log} />
        </Box>
      </Box>

      {!userListVisible && (
        <SideOverlay
          anchor="right"
          visible={userListOverlay.on}
          // TODO: instead of stopping propagation, use an onShadeClick prop
          // stopPropagation prevents the user menu from closing
          onClick={userListOverlay.disable}
        >
          <Box elevated onClick={(e) => e.stopPropagation()}>
            <ChannelUserList channel={channel} />
          </Box>
        </SideOverlay>
      )}
    </>
  )
}
export default observer(ChannelView)
