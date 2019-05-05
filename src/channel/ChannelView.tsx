import { observer } from "mobx-react-lite"
import React from "react"
import Chatbox from "../chat/Chatbox"
import useChatNavBreakpoint from "../chat/useChatNavBreakpoint"
import MessageList from "../message/MessageList"
import { OverlayProvider } from "../overlay/OverlayContext"
import OverlayShade from "../overlay/OverlayShade"
import OverlaySidePanel from "../overlay/OverlaySidePanel"
import { useRootStore } from "../RootStore"
import BBC from "../ui/BBC"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"
import { gapSizes } from "../ui/theme"
import useMedia from "../ui/useMedia"
import useToggleState from "../ui/useToggleState"
import ChannelDescriptionOverlay from "./ChannelDescriptionOverlay"
import ChannelFilters from "./ChannelFilters"
import ChannelModel from "./ChannelModel"
import ChannelUserList from "./ChannelUserList"

const userListBreakpoint = 1200

type Props = { channel: ChannelModel }

function ChannelView({ channel }: Props) {
  const { overlayStore } = useRootStore()
  const userListVisible = useMedia(`(min-width: ${userListBreakpoint}px)`)
  const descriptionUi = useToggleState()
  const isChatNavVisible = useChatNavBreakpoint()

  const showChatNav = () => {
    overlayStore.chatNav.open()
  }

  const showUsersOverlay = () => {
    overlayStore.userList.open()
  }

  const channelHeader = (
    <Box background="theme0" style={{ position: "relative" }}>
      <Box
        pad={gapSizes.small}
        gap={gapSizes.small}
        direction="row"
        align="center"
      >
        <Box direction="row" align="center" gap={gapSizes.xsmall} flex>
          {!isChatNavVisible && (
            <FadedButton onClick={showChatNav}>
              <Icon icon="menu" />
            </FadedButton>
          )}

          <Box
            as={ChannelTitleButton}
            direction="row"
            gap={gapSizes.xsmall}
            align="center"
            onClick={descriptionUi.toggle}
          >
            <h3>{channel.name}</h3>
            <Icon icon="about" style={{ opacity: 0.5 }} />
          </Box>
        </Box>

        <ChannelFilters channel={channel} />

        {!userListVisible && (
          <FadedButton onClick={showUsersOverlay}>
            <Icon icon="users" />
          </FadedButton>
        )}
      </Box>
    </Box>
  )

  return (
    <>
      <Box as="main" flex>
        {/* room content */}
        <Box direction="row" flex gap={gapSizes.xsmall}>
          <Box flex>
            {channelHeader}

            <Box flex background="theme1" style={{ position: "relative" }}>
              <ChannelDescriptionOverlay
                isVisible={descriptionUi.on}
                onClose={descriptionUi.disable}
              >
                <BBC text={channel.description} />
              </ChannelDescriptionOverlay>

              <MessageList messages={channel.filteredMessages} />
            </Box>
          </Box>

          {userListVisible && <ChannelUserList channel={channel} />}
        </Box>

        {/* chatbox */}
        <Box background="theme0" pad={gapSizes.xsmall}>
          <Chatbox onSubmit={console.log} />
        </Box>
      </Box>

      <OverlayProvider value={overlayStore.userList}>
        <OverlayShade>
          <OverlaySidePanel side="right">
            <ChannelUserList channel={channel} />
          </OverlaySidePanel>
        </OverlayShade>
      </OverlayProvider>
    </>
  )
}
export default observer(ChannelView)

const ChannelTitleButton = styled(FadedButton)`
  opacity: 0.7;

  :hover,
  :focus {
    opacity: 1;
  }
`
