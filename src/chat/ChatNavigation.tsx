import { Box } from "grommet"
import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import CharacterInfo from "../character/CharacterInfo"
import { useRootStore } from "../RootStore"
import Icon from "../ui/Icon"
import { ThemeColor } from "../ui/theme"
import RoomTab from "./RoomTab"

function ChatNavigation() {
  const { chatStore, channelStore, viewStore } = useRootStore()

  return (
    <Box as="nav" direction="row">
      <Box pad="small">
        <Box flex gap="medium">
          <Icon style={{ opacity: 0.5 }} icon="channels" />
          <Icon style={{ opacity: 0.5 }} icon="updateStatus" />
          <Icon style={{ opacity: 0.5 }} icon="about" />
        </Box>
        <Icon icon="logout" style={{ opacity: 0.5 }} />
      </Box>

      <Box width="small" background={ThemeColor.bgDark}>
        <Box background={ThemeColor.bg} pad="small">
          <CharacterInfo name={chatStore.identity} />
        </Box>

        <Box flex>
          <RoomTab icon={<Icon icon="console" size={0.9} />} title="Console" />

          {channelStore.channels.values.map((channel) => (
            <RoomTab
              icon={<Icon icon="channels" size={0.9} />}
              title={channel.name}
              active={viewStore.isChannelActive(channel.id)}
              onClick={() => viewStore.showChannel(channel.id)}
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
