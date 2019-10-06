import { observer } from "mobx-react-lite"
import React from "react"
import Icon from "../../ui/components/Icon"
import useRootStore from "../../useRootStore"
import RoomTab from "./RoomTab"

function ChatRoomList() {
  const { channelStore, chatStore } = useRootStore()

  return (
    <>
      {channelStore.joinedChannels.map(({ id, name, unread }) => (
        <RoomTab
          key={id}
          title={name}
          icon={<Icon icon={id === name ? "public" : "lock"} />}
          active={chatStore.currentChannelId === id}
          unread={unread}
          loading={false}
          onClick={() => chatStore.setCurrentRoom({ type: 'channel', id })}
          onClose={() => channelStore.leave(id)}
        />
      ))}
    </>
  )
}

export default observer(ChatRoomList)
