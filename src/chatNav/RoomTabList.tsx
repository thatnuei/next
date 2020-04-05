import { observer } from "mobx-react-lite"
import React from "react"
import tw from "twin.macro"
import { useChannelBrowserHelpers } from "../channelBrowser/state"
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
  const { isPublic } = useChannelBrowserHelpers()

  function getTitle(room: Room) {
    if (room.type === "privateChat") {
      return room.partnerName
    }

    const channel = state.channels.get(room.id)
    return channel.title || channel.id // to account for a blank title when restoring saved rooms
  }

  function getIcon(room: Room) {
    if (room.type === "privateChat") {
      return <Avatar name={room.partnerName} css={tw`w-5 h-5`} />
    }

    return isPublic(room.id) ? (
      <Icon which={icons.earth} css={tw`w-5 h-5`} />
    ) : (
      <Icon which={icons.lock} css={tw`w-5 h-5`} />
    )
  }

  function getSortGroup(room: Room) {
    if (room.type === "privateChat") return 0
    if (isPublic(room.id)) return 1
    return 2
  }

  return state.roomList.rooms
    .slice()
    .sort(compare(getTitle))
    .sort(compare(getSortGroup))
    .map((room) => (
      <RoomTab
        key={room.key}
        title={getTitle(room)}
        icon={getIcon(room)}
        isActive={room === currentRoom}
        isUnread={room.isUnread}
        onClick={() => setRoom(room)}
        onClose={() => closeRoom(room)}
      />
    )) as any
}

export default observer(RoomTabList)
