import React from "react"
import { useJoinedChannels } from "../../channel/hooks"
import { useStore } from "../../store/hooks"
import Icon from "../../ui/components/Icon"
import RoomTab from "./RoomTab"

type Props = {}

function ChatRoomList(props: Props) {
  const joinedChannels = useJoinedChannels()
  const { actions } = useStore()
  return (
    <>
      {joinedChannels.map(({ id, title, entryAction }) => (
        <RoomTab
          key={id}
          title={title}
          icon={<Icon icon={id === title ? "public" : "lock"} />}
          active={false}
          unread={false}
          loading={entryAction === "leaving"}
          onClick={() => {}}
          onClose={() => actions.channel.leaveChannel(id)}
        />
      ))}
    </>
  )
}

export default ChatRoomList
