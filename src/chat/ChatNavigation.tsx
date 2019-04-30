import { observer } from "mobx-react-lite"
import React, { useContext } from "react"
import Avatar from "../character/Avatar"
import CharacterInfo from "../character/CharacterInfo"
import { useRootStore } from "../RootStore"
import Box from "../ui/Box"
import FadedButton from "../ui/FadedButton"
import Icon from "../ui/Icon"
import ModalOverlay from "../ui/ModalOverlay"
import ModalPanel from "../ui/ModalPanel"
import ModalPanelHeader from "../ui/ModalPanelHeader"
import { gapSizes } from "../ui/theme"
import useToggleState from "../ui/useToggleState"
import { NavigationOverlayContext } from "./ChatScreen"
import RoomTab from "./RoomTab"
import StatusForm from "./StatusForm"

function ChatNavigation() {
  const { chatStore, channelStore, viewStore } = useRootStore()
  const navOverlay = useContext(NavigationOverlayContext)
  const statusOverlay = useToggleState()

  return (
    <>
      <Box as="nav" direction="row" style={{ height: "100%" }}>
        <Box pad={gapSizes.small} background="theme2">
          <Box flex gap={gapSizes.medium}>
            <FadedButton>
              <Icon icon="channels" />
            </FadedButton>
            <FadedButton onClick={statusOverlay.enable}>
              <Icon icon="updateStatus" />
            </FadedButton>
            <FadedButton>
              <Icon icon="heart" />
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
            <RoomTab
              icon={<Icon icon="console" size={0.9} />}
              title="Console"
            />

            {channelStore.joinedChannels.map((channel) => (
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

      <ModalOverlay
        isVisible={statusOverlay.on}
        onClose={statusOverlay.disable}
      >
        <ModalPanel>
          <ModalPanelHeader>Update Status</ModalPanelHeader>
          <StatusForm
            onSubmit={statusOverlay.disable}
            onCancel={statusOverlay.disable}
          />
        </ModalPanel>
      </ModalOverlay>
    </>
  )
}
export default observer(ChatNavigation)
