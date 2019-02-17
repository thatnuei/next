import { observer } from "mobx-react-lite"
import React from "react"
import ChannelRoomView from "../channel/ChannelRoomView"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"

const ChatScreen = () => {
  const {
    chatStore: { identity },
    viewStore: { screen },
    channelStore: { channels },
  } = useRootStore()

  const renderRoom = () => {
    switch (screen.name) {
      case "channel":
        return <ChannelRoomView channel={channels.get(screen.channel)} />
      default:
        return <p>view not found</p>
    }
  }

  return <AppDocumentTitle title={identity}>{renderRoom()}</AppDocumentTitle>
}
export default observer(ChatScreen)
