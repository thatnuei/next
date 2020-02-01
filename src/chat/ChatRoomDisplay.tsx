import React from "react"
import ChannelRoom from "../channel/ChannelRoom"
import PrivateChatRoom from "../private-chat/PrivateChatRoom"
import { useChannelStore, usePrivateChatStore } from "./ChatContext"
import { ChatNavigationRoom } from "./ChatNavigationStore"

type Props = {
  room: ChatNavigationRoom
}

export default function ChatRoomDisplay({ room }: Props) {
  const channelStore = useChannelStore()
  const privateChatStore = usePrivateChatStore()

  if (room.type === "channel") {
    return <ChannelRoom channel={channelStore.get(room.channelId)} />
  }

  if (room.type === "privateChat") {
    return <PrivateChatRoom chat={privateChatStore.get(room.partnerName)} />
  }

  return null
}
