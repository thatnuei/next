import { observer } from "mobx-react-lite"
import React from "react"
import ChannelView from "../../channel/ChannelView"
import PrivateChat from "../../private-chat/PrivateChat"
import useRootStore from "../../useRootStore"
import NoRoomHeader from "./NoRoomHeader"

function ChatRoomView() {
  const { chatNavigationStore } = useRootStore()
  const { currentRoom } = chatNavigationStore

  if (!currentRoom) {
    return <NoRoomHeader />
  }

  switch (currentRoom.type) {
    case "channel":
      return <ChannelView channel={currentRoom.channel} />
    case "privateChat":
      return <PrivateChat privateChat={currentRoom.chat} />
  }
}

export default observer(ChatRoomView)
