import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import Avatar from "../character/Avatar"
import { useChatContext } from "../chat/context"
import { compare } from "../common/compare"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import RoomTab from "./RoomTab"
import { Room, useChatNav } from "./state"

function RoomTabList() {
  const { state } = useChatContext()
  const { currentRoom, setRoom, closeRoom } = useChatNav()

  function getTitle(room: Room) {
    return room.type === "channel"
      ? state.channels.get(room.id).title
      : room.partnerName
  }

  return state.roomList.rooms
    .slice()
    .sort(compare(getTitle))
    .sort(compare((room) => (room.type === "privateChat" ? 0 : 1)))
    .map((room) => {
      const title = getTitle(room)

      const icon =
        room.type === "channel" ? (
          <Icon which={icons.earth} css={tw`w-5 h-5`} />
        ) : (
          <Avatar name={room.partnerName} css={tw`w-5 h-5`} />
        )

      return (
        <RoomTab
          key={room.key}
          icon={icon}
          title={title}
          isActive={room === currentRoom}
          isUnread={room.isUnread}
          onClick={() => setRoom(room)}
          onClose={() => closeRoom(room)}
        />
      )
    }) as any
}

export default observer(RoomTabList)
