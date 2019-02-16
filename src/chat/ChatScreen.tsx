import { observer, useObserver } from "mobx-react-lite"
import React from "react"
import ChannelRoomView from "../channel/ChannelRoomView"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"

function ChatScreen() {
  const { chatStore } = useRootStore()

  return (
    <AppDocumentTitle title={chatStore.identity}>
      <ChatRoomView />
    </AppDocumentTitle>
  )
}
export default observer(ChatScreen)

function ChatRoomView() {
  const { viewStore, channelStore } = useRootStore()

  return useObserver(() => {
    const { screen } = viewStore
    const { channels } = channelStore

    switch (screen.name) {
      case "channel":
        return <ChannelRoomView channel={channels.get(screen.channel)} />
    }

    return <p>view not found</p>
  })
}
