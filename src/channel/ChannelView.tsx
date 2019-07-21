import { observer } from "mobx-react-lite"
import React from "react"
import Chatbox from "../chat/Chatbox"
import ChatMenuButton from "../chat/ChatMenuButton"
import MessageList from "../message/MessageList"
import { OverlayProvider } from "../overlay/OverlayContext"
import OverlayShade from "../overlay/OverlayShade"
import OverlaySidePanel from "../overlay/OverlaySidePanel"
import { useRootStore } from "../RootStore"
import BBC from "../bbc/BBC"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import { fillArea, flexColumn } from "../ui/helpers"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import useMedia from "../ui/useMedia"
import useToggleState from "../ui/useToggleState"
import ChannelDescriptionOverlay from "./ChannelDescriptionOverlay"
import ChannelFilters from "./ChannelFilters"
import ChannelModel from "./ChannelModel"
import ChannelUserList from "./ChannelUserList"

const userListBreakpoint = 1200

type Props = { channel: ChannelModel }

function ChannelView({ channel }: Props) {
  const { overlayStore, channelStore } = useRootStore()
  const userListVisible = useMedia(`(min-width: ${userListBreakpoint}px)`)
  const descriptionUi = useToggleState()

  const showUsersOverlay = () => {
    overlayStore.userList.open()
  }

  const sendMessage = (message: string) => {
    channelStore.sendMessage(channel.id, message)
  }

  const handleCommand = (command: string, ...args: string[]) => {
    switch (command) {
      case "roll": {
        const dice = args.length > 0 ? args.join(" ") : "1d20"
        channelStore.sendRoll(channel.id, dice)
        break
      }

      case "bottle":
        channelStore.sendBottle(channel.id)
        break

      default:
        console.error(`Unknown command /${command} ${args.join(" ")}`)
    }
  }

  const channelHeader = (
    <Box background="theme0" style={{ position: "relative" }}>
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
      <Container>
        {/* room content */}
        <Box direction="row" flex gap={spacing.xsmall}>
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
        <Box background="theme0" pad={spacing.xsmall}>
          <Chatbox onSubmit={sendMessage} onSubmitCommand={handleCommand} />
        </Box>
      </Container>

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

const Container = styled.div`
  ${flexColumn};
  ${fillArea};
`

const ChannelTitleButton = styled(FadedButton)`
  opacity: 0.7;

  :hover {
    opacity: 1;
  }
`
