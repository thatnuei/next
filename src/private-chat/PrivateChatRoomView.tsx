import React from "react"
import Chatbox from "../chat/Chatbox"
import ChatRoomHeader from "../chat/ChatRoomHeader"
import MessageList from "../message/MessageList"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import { flexColumn, fullscreen } from "../ui/helpers"

type PrivateChatRoomViewProps = {
  partnerName: string
}

const PrivateChatRoomView = (props: PrivateChatRoomViewProps) => {
  const { chatStore, privateChatStore } = useRootStore()
  const chat = privateChatStore.privateChats.get(props.partnerName)

  return (
    <AppDocumentTitle title={`${chatStore.identity} - ${props.partnerName}`}>
      <div css={[fullscreen, flexColumn]}>
        <ChatRoomHeader>
          <h2>{props.partnerName}</h2>
        </ChatRoomHeader>
        <MessageList messages={chat.messages} />
        <Chatbox onSubmit={console.log} />
      </div>
    </AppDocumentTitle>
  )
}

export default PrivateChatRoomView
