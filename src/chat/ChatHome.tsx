import React from "react"
import Avatar from "../character/Avatar"
import CharacterDetails from "../character/CharacterDetails"
import { TagProps } from "../jsx/types"
import Icon, { iconSize } from "../ui/Icon"
import * as icons from "../ui/icons"
import {
  flex1,
  flexColumn,
  mb,
  p,
  scrollVertical,
  size,
  themeBgColor,
} from "../ui/style"
import { gapSize, RoomView } from "./Chat"
import { chatState, testificate } from "./mockData"
import RoomTab from "./RoomTab"
import { ChatState } from "./types"

type Props = TagProps<"div"> & {
  rooms: RoomView[]
  activeRoom: RoomView | undefined
  onRoomChange: (tab: RoomView) => void
}

function ChatHome({ rooms, activeRoom, onRoomChange, ...props }: Props) {
  return (
    <div css={[size("full"), flexColumn, scrollVertical]} {...props}>
      <div css={[themeBgColor(0), mb(gapSize), p(3)]}>
        <CharacterDetails character={testificate} />
      </div>
      <div css={[themeBgColor(1), flex1]}>
        {rooms.map((room) => (
          <RoomTab
            {...getRoomProps(room, chatState)}
            state={activeRoom === room ? "active" : "inactive"}
            onClick={() => onRoomChange(room)}
          />
        ))}
      </div>
    </div>
  )
}

export default ChatHome

function getRoomProps(room: RoomView, chatState: ChatState) {
  if (room.name === "channel") {
    const channel = chatState.channels[room.channelId]
    return {
      key: `channel:${room.channelId}`,
      title: channel?.title ?? room.channelId,
      icon: <Icon which={icons.earth} />,
    }
  }

  return {
    key: `private-chat:${room.partnerName}`,
    title: room.partnerName,
    icon: <Avatar name={room.partnerName} css={size(iconSize(3))} />,
  }
}
