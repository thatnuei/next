import React from "react"
import { useJoinedChannels } from "../../channel/hooks"
import { useStore } from "../../store/hooks"
import Icon from "../../ui/components/Icon"
import { ChatRoom } from "../state"
import RoomTab from "./RoomTab"

type Props = {}

function ChatRoomList(props: Props) {
  const joinedChannels = useJoinedChannels()
  const { actions, state } = useStore()
  const currentRoom = state.chat.currentRoom as (ChatRoom | undefined)

  return (
    <>
      {joinedChannels.map(({ id, title, entryAction }) => (
        <RoomTab
          key={id}
          title={title}
          icon={<Icon icon={id === title ? "public" : "lock"} />}
          active={
            currentRoom != null &&
            currentRoom.type === "channel" &&
            currentRoom.id === id
          }
          unread={false}
          loading={entryAction === "leaving"}
          onClick={() => actions.chat.showChannel(id)}
          onClose={() => actions.channel.leaveChannel(id)}
        />
      ))}
    </>
  )
}

export default ChatRoomList
