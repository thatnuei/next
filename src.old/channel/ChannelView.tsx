import { observer } from "mobx-react-lite"
import React from "react"
import BBC from "../bbc/BBC"
import Chatbox from "../chat/Chatbox"
import MessageList from "../message/MessageList"
import { OverlayProvider } from "../overlay/OverlayContext"
import OverlayShade from "../overlay/OverlayShade"
import OverlaySidePanel from "../overlay/OverlaySidePanel"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import { fillArea, flexColumn } from "../ui/helpers"
import Icon from "../ui/Icon"
import { styled } from "../ui/styled"
import { spacing } from "../ui/theme"
import useMedia from "../ui/useMedia"
import useToggleState from "../ui/useToggleState"
import ChannelDescriptionOverlay from "./ChannelDescriptionOverlay"
import ChannelHeader from "./ChannelHeader"
import ChannelModel from "./ChannelModel"
import ChannelUserList from "./ChannelUserList"

const userListBreakpoint = 1200

type Props = { channel: ChannelModel }

function ChannelView({ channel }: Props) {
  const { overlayStore, channelStore } = useRootStore()
  const descriptionUi = useToggleState()

  const shouldShowDesktopUserList = useMedia(
    `(min-width: ${userListBreakpoint}px)`,
  )

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

  const userListButton = shouldShowDesktopUserList ? null : (
    <FadedButton onClick={showUsersOverlay}>
      <Icon icon="users" />
    </FadedButton>
  )

  return (
    <>
      <Container>
        {/* room content */}
        <Box direction="row" flex gap={spacing.xsmall}>
          <Box flex>
            <ChannelHeader
              channel={channel}
              userListButton={userListButton}
              onToggleDescription={descriptionUi.toggle}
            />

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

          {shouldShowDesktopUserList && <ChannelUserList channel={channel} />}
        </Box>

        {/* chatbox */}
        <Box background="theme0" pad={spacing.xsmall}>
          <Chatbox
            value={channel.chatboxInput}
            onValueChange={channel.setChatboxInput}
            onSubmit={sendMessage}
            onSubmitCommand={handleCommand}
          />
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
