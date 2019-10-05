import React from "react"
import { useSelector, useStore } from "../../store/hooks"
import { getJoinedChannels } from "../../store/selectors"
import Icon from "../../ui/components/Icon"
import RoomTab from "./RoomTab"

type Props = {}

function ChatRoomList(props: Props) {
  const joinedChannels = useSelector(getJoinedChannels())
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
