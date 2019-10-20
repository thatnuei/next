import { observer } from "mobx-react-lite"
import React from "react"
import Avatar from "../../character/components/Avatar"
import Icon from "../../ui/components/Icon"
import useRootStore from "../../useRootStore"
import RoomTab from "./RoomTab"

function ChatRoomList() {
  const { channelStore, privateChatStore, chatNavigationStore } = useRootStore()

  return (
    <>
      {chatNavigationStore.channelRooms.map(({ key, channel }) => {
        const icon = channel.id === channel.name ? "public" : "lock"
        return (
          <RoomTab
            key={key}
            title={channel.name}
            icon={<Icon icon={icon} />}
            isActive={chatNavigationStore.isCurrentChannel(channel.id)}
            isUnread={channel.unread}
            isLoading={channel.isLoading}
            onClick={() => chatNavigationStore.setCurrentRoom(key)}
            onClose={() => channelStore.leave(channel.id)}
          />
        )
      })}

      {chatNavigationStore.privateChatRooms.map(({ key, chat }) => (
        <RoomTab
          key={key}
          title={chat.partner}
          icon={<Avatar name={chat.partner} size={20} />}
          isActive={chatNavigationStore.isCurrentPrivateChat(chat.partner)}
          isUnread={chat.unread}
          onClick={() => chatNavigationStore.setCurrentRoom(key)}
          onClose={() => privateChatStore.closeChat(chat.partner)}
        />
      ))}
    </>
  )
}

export default observer(ChatRoomList)
