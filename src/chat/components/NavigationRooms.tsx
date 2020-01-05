import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../../character/components/Avatar"
import Icon from "../../ui/components/Icon"
import { ChatNavigationStore } from "../ChatNavigationStore.new"
import RoomTab from "./RoomTab"

type Props = {
  navigation: ChatNavigationStore
}

function NavigationRooms(props: Props) {
  return props.navigation.rooms.map((room) => {
    const icon =
      room.icon.type === "public" ? (
        <Icon icon="public" />
      ) : (
        <Avatar name={room.icon.name} size={20} />
      )

    return (
      <RoomTab
        key={room.roomId}
        title={room.title}
        icon={icon}
        isActive={props.navigation.currentRoom === room}
        isUnread={room.isUnread}
        onClick={room.show}
        onClose={room.close}
      />
    )
  }) as any
}

export default observer(NavigationRooms)
