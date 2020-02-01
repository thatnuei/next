import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../character/Avatar"
import Icon from "../ui/components/Icon"
import {
  useChannelStore,
  useChatNavigationStore,
  usePrivateChatStore,
} from "./ChatContext"
import RoomTab from "./RoomTab"

function NavigationRooms() {
  const navigation = useChatNavigationStore()
  const channelStore = useChannelStore()
  const privateChatStore = usePrivateChatStore()

  return navigation.rooms.map((room) => {
    const commonProps = {
      key: room.key,
      isActive: navigation.isActive(room.key),
      onClick: () => navigation.setCurrentRoomKey(room.key),
    }

    switch (room.type) {
      case "channel": {
        const channel = channelStore.get(room.channelId)
        return (
          <RoomTab
            title={channel.name}
            icon={<Icon name="public" />}
            isUnread={channel.room.unread}
            onClose={() => channelStore.leave(room.channelId)}
            {...commonProps}
          />
        )
      }

      case "privateChat": {
        const chat = privateChatStore.get(room.partnerName)
        return (
          <RoomTab
            title={chat.partnerName}
            icon={<Avatar name={chat.partnerName} size={20} />}
            isUnread={chat.room.unread}
            onClose={() => navigation.closePrivateChat(room.partnerName)}
            {...commonProps}
          />
        )
      }

      default:
        return null
    }
  }) as any
}

export default observer(NavigationRooms)
