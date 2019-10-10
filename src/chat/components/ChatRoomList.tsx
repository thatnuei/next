import { observer } from "mobx-react-lite"
import React from "react"
import Icon from "../../ui/components/Icon"
import useRootStore from "../../useRootStore"
import RoomTab from "./RoomTab"

function ChatRoomList() {
  const { channelStore, chatNavigationStore } = useRootStore()

  return (
    <>
      {chatNavigationStore.channelRooms.map((room) => {
        const channel = channelStore.channels.get(room.channelId)
        const icon = channel.id === channel.name ? "public" : "lock"
        return (
          <RoomTab
            key={room.key}
            title={channel.name}
            icon={<Icon icon={icon} />}
            active={chatNavigationStore.currentRoom === room}
            unread={channel.unread}
            loading={false}
            onClick={() => chatNavigationStore.setCurrentRoom(room.key)}
            onClose={() => channelStore.leave(channel.id)}
          />
        )
      })}
    </>
  )
}

export default observer(ChatRoomList)
