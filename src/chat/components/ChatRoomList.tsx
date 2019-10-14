import { observer } from "mobx-react-lite"
import React from "react"
import Icon from "../../ui/components/Icon"
import useRootStore from "../../useRootStore"
import RoomTab from "./RoomTab"

function ChatRoomList() {
  const { channelStore, chatNavigationStore } = useRootStore()

  return (
    <>
      {chatNavigationStore.channelRooms.map(({ key, channel }) => {
        const icon = channel.id === channel.name ? "public" : "lock"
        return (
          <RoomTab
            key={key}
            title={channel.name}
            icon={<Icon icon={icon} />}
            active={chatNavigationStore.isCurrentRoom(key)}
            unread={channel.unread}
            loading={channel.isLoading}
            onClick={() => chatNavigationStore.setCurrentRoom(key)}
            onClose={() => channelStore.leave(channel.id)}
          />
        )
      })}
    </>
  )
}

export default observer(ChatRoomList)
