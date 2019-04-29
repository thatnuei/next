import { observer } from "mobx-react-lite"
import React, { useContext } from "react"
import Avatar from "../character/Avatar"
import CharacterInfo from "../character/CharacterInfo"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import { gapSizes } from "../ui/theme"
import { NavigationOverlayContext } from "./ChatScreen"
import RoomTab from "./RoomTab"

function ChatNavigation() {
  const { chatStore, channelStore, viewStore } = useRootStore()
  const navOverlay = useContext(NavigationOverlayContext)

  return (
    <Box as="nav" direction="row" style={{ height: "100%" }}>
      <Box pad={gapSizes.small} background="theme2">
        <Box flex gap={gapSizes.medium}>
          <FadedButton>
            <Icon icon="channels" />
          </FadedButton>
          <FadedButton>
            <Icon icon="updateStatus" />
          </FadedButton>
          <FadedButton>
            <Icon icon="about" />
          </FadedButton>
        </Box>
        <FadedButton>
          <Icon icon="logout" style={{ opacity: 0.5 }} />
        </FadedButton>
      </Box>

      <Box width={200} background="theme1" overflowY="auto">
        <Box
          background="theme0"
          pad={gapSizes.small}
          flexGrow={0}
          flexShrink={0}
        >
          <CharacterInfo name={chatStore.identity} />
        </Box>

        <Box flexGrow={1} flexShrink={0}>
          <RoomTab icon={<Icon icon="console" size={0.9} />} title="Console" />

          {channelStore.channels.values.map((channel) => (
            <RoomTab
              key={channel.id}
              icon={<Icon icon="channels" size={0.9} />}
              title={channel.name}
              active={viewStore.isChannelActive(channel.id)}
              onClick={() => {
                viewStore.showChannel(channel.id)
                navOverlay.hide()
              }}
              onClose={() => channelStore.leave(channel.id)}
            />
          ))}

          <RoomTab
            icon={<Avatar name="Subaru-chan" size={20} />}
            title="Subaru-chan"
          />
        </Box>
      </Box>
    </Box>
  )
}
export default observer(ChatNavigation)
