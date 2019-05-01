import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import { useRootStore } from "../RootStore"
import Icon from "../ui/Icon"
import ChatNavigationOverlay from "./ChatNavigationOverlay"
import RoomTab from "./RoomTab"

function NavigationTabs() {
  const { channelStore, viewStore, overlayStore } = useRootStore()

  return (
    <>
      <RoomTab icon={<Icon icon="console" size={0.9} />} title="Console" />

      {channelStore.joinedChannels.map((channel) => (
        <RoomTab
          key={channel.id}
          icon={<Icon icon="channels" size={0.9} />}
          title={channel.name}
          active={viewStore.isChannelActive(channel.id)}
          onClick={() => {
            viewStore.showChannel(channel.id)
            overlayStore.close(ChatNavigationOverlay.key)
          }}
          onClose={() => channelStore.leave(channel.id)}
        />
      ))}

      <RoomTab
        icon={<Avatar name="Subaru-chan" size={20} />}
        title="Subaru-chan"
      />
    </>
  )
}

export default observer(NavigationTabs)
