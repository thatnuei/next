import React from "react"
import tw from "twin.macro"
import Avatar from "../character/Avatar"
import CharacterDetails from "../character/CharacterDetails"
import { TagProps } from "../jsx/types"
import { scrollVertical } from "../ui/helpers"
import Icon from "../ui/Icon"
import * as icons from "../ui/icons"
import { RoomView } from "./Chat"
import { ChatState } from "./state"
import { chatState, testificate } from "./mockData"
import RoomTab from "./RoomTab"

type Props = TagProps<"div"> & {
  rooms: RoomView[]
  activeRoom: RoomView | undefined
  onRoomChange: (tab: RoomView) => void
}

function ChatHome({ rooms, activeRoom, onRoomChange, ...props }: Props) {
  return (
    <div css={[tw`w-full h-full flex flex-col`, scrollVertical]} {...props}>
      <div css={tw`bg-background-0 mb-gap p-3`}>
        <CharacterDetails character={testificate} />
      </div>
      <div css={tw`bg-background-1 flex-1`}>
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
  const iconSizeStyle = tw`w-5 h-5`

  if (room.name === "channel") {
    const channel = chatState.channels[room.channelId]
    return {
      key: `channel:${room.channelId}`,
      title: channel?.title ?? room.channelId,
      icon: <Icon which={icons.earth} css={iconSizeStyle} />,
    }
  }

  return {
    key: `private-chat:${room.partnerName}`,
    title: room.partnerName,
    icon: <Avatar name={room.partnerName} css={iconSizeStyle} />,
  }
}
