import React from "react"
import { useSelector } from "../../store/hooks"
import { getJoinedChannels } from "../../store/selectors"

type Props = {}

function ChatRoomList(props: Props) {
  const joinedChannels = useSelector(getJoinedChannels())
  return (
    <ul>
      {joinedChannels.map((channel) => (
        <li key={channel.id}>{channel.title}</li>
      ))}
    </ul>
  )
}

export default ChatRoomList
