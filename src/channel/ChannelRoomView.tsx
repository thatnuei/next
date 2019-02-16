import { observer } from "mobx-react-lite"
import React from "react"
import Chatbox from "../chat/Chatbox"
import ChatRoomHeader from "../chat/ChatRoomHeader"
import MessageList from "../message/MessageList"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import { flexColumn, fullscreen } from "../ui/helpers"
import ChannelHeader from "./ChannelHeader"
import ChannelModel from "./ChannelModel"

type Props = {
  channel: ChannelModel
}

function ChannelRoomView({ channel }: Props) {
  const { chatStore } = useRootStore()

  return (
    <AppDocumentTitle title={`${chatStore.identity} - ${channel.name}`}>
      <div css={[fullscreen, flexColumn]}>
        <ChatRoomHeader>
          <ChannelHeader channel={channel} />
        </ChatRoomHeader>
        <MessageList messages={channel.filteredMessages} />
        <Chatbox />
      </div>
    </AppDocumentTitle>
  )
}
export default observer(ChannelRoomView)
