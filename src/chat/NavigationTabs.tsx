import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import { useRootStore } from "../RootStore"
import Icon from "../ui/Icon"
import RoomTab from "./RoomTab"

function NavigationTabs() {
  const {
    channelStore,
    privateChatStore,
    viewStore,
    overlayStore,
  } = useRootStore()

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
            overlayStore.chatNav.close()
          }}
          onClose={() => channelStore.leave(channel.id)}
        />
      ))}

      {privateChatStore.chats.map((chat) => (
        <RoomTab
          key={chat.partner}
          icon={<Avatar name={chat.partner} size={20} />}
          title={chat.partner}
          active={viewStore.isPrivateChatActive(chat.partner)}
          onClick={() => {
            viewStore.showPrivateChat(chat.partner)
            overlayStore.chatNav.close()
          }}
          onClose={() => privateChatStore.closeChat(chat.partner)}
        />
      ))}
    </>
  )
}

export default observer(NavigationTabs)
