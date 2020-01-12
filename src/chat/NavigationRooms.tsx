import { observer } from "mobx-react-lite"
import React from "react"
import { ChannelStore } from "../channel/ChannelStore"
import Avatar from "../character/Avatar"
import { PrivateChatStore } from "../private-chat/PrivateChatStore"
import Icon from "../ui/components/Icon"
import { ChatNavigationStore } from "./ChatNavigationStore"
import RoomTab from "./RoomTab"

type Props = {
  navigation: ChatNavigationStore
  channelStore: ChannelStore
  privateChatStore: PrivateChatStore
}

function NavigationRooms(props: Props) {
  return props.navigation.rooms.map((room) => {
    const commonProps = {
      key: room.key,
      isActive: props.navigation.isActive(room.key),
      onClick: () => props.navigation.setCurrentRoomKey(room.key),
    }

    switch (room.type) {
      case "channel": {
        const channel = props.channelStore.get(room.channelId)
        return (
          <RoomTab
            title={channel.name}
            icon={<Icon name="public" />}
            isUnread={channel.room.unread}
            onClose={() => props.channelStore.leave(room.channelId)}
            {...commonProps}
          />
        )
      }

      case "privateChat": {
        const chat = props.privateChatStore.get(room.partnerName)
        return (
          <RoomTab
            title={chat.partnerName}
            icon={<Avatar name={chat.partnerName} size={20} />}
            isUnread={chat.room.unread}
            onClose={() => props.navigation.closePrivateChat(room.partnerName)}
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
