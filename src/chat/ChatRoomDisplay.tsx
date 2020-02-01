import React from "react"
import ChannelRoom from "../channel/ChannelRoom"
import { ChannelStore } from "../channel/ChannelStore"
import { CharacterStore } from "../character/CharacterStore"
import PrivateChatRoom from "../private-chat/PrivateChatRoom"
import { PrivateChatStore } from "../private-chat/PrivateChatStore"
import { ChatNavigationRoom } from "./ChatNavigationStore"

type Props = {
  room: ChatNavigationRoom
  identity: string
  characterStore: CharacterStore
  channelStore: ChannelStore
  privateChatStore: PrivateChatStore
}

export default function ChatRoomDisplay({
  room,
  identity,
  characterStore,
  channelStore,
  privateChatStore,
}: Props) {
  const commonProps = { identity, characterStore }

  if (room.type === "channel") {
    return (
      <ChannelRoom
        channel={channelStore.get(room.channelId)}
        {...commonProps}
      />
    )
  }

  if (room.type === "privateChat") {
    return (
      <PrivateChatRoom
        chat={privateChatStore.get(room.partnerName)}
        {...commonProps}
      />
    )
  }

  return null
}
