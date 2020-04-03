import { observer } from "mobx-react-lite"
import React from "react"
import { useChatContext } from "../chat/context"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import RoomTab from "./RoomTab"
import { useChatNav } from "./state"

function RoomTabList() {
  const { state } = useChatContext()
  const { currentRoom, setRoom } = useChatNav()

  return state.roomList.rooms.map((room) => {
    const title =
      room.type === "channel" ? state.channels.get(room.id).title : ""

    return (
      <RoomTab
        key={room.key}
        icon={<Icon which={icons.earth} />}
        title={title}
        isActive={room === currentRoom}
        isUnread={false}
        onClick={() => setRoom(room)}
      />
    )
  }) as any
}

export default observer(RoomTabList)
