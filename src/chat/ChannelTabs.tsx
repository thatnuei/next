import { observer } from "mobx-react-lite"
import React from "react"
import { useChatNav } from "../chatNav/state"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { useChatContext } from "./context"
import RoomTab from "./RoomTab"

function ChannelTabs() {
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
        state={room === currentRoom ? "active" : "inactive"}
        onClick={() => {
          setRoom(room)
          state.sideMenuOverlay.hide()
        }}
      />
    )
  }) as any
}

export default observer(ChannelTabs)
