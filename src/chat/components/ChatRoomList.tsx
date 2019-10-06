import React from "react"
import { useJoinedChannels } from "../../channel/hooks"
import { useStore } from "../../store/hooks"
import Icon from "../../ui/components/Icon"
import RoomTab from "./RoomTab"

function ChatRoomList() {
  const joinedChannels = useJoinedChannels()
  const { actions, state } = useStore()

  return (
    <>
      {joinedChannels.map(({ id, title, isUnread, entryAction }) => (
        <RoomTab
          key={id}
          title={title}
          icon={<Icon icon={id === title ? "public" : "lock"} />}
          active={state.chat.currentChannelId === id}
          unread={isUnread}
          loading={entryAction === "leaving"}
          onClick={() => actions.channel.showChannel(id)}
          onClose={() => actions.channel.leaveChannel(id)}
        />
      ))}
    </>
  )
}

export default ChatRoomList
