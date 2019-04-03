import React from "react"
import Chatbox from "../chat/Chatbox"
import ChatRoomHeader from "../chat/ChatRoomHeader"
import MessageList from "../message/MessageList"
import { useRootStore } from "../RootStore"
import AppDocumentTitle from "../ui/AppDocumentTitle"
import { styled } from "../ui/styled"

type PrivateChatRoomViewProps = {
  partnerName: string
}

const PrivateChatRoomView = (props: PrivateChatRoomViewProps) => {
  const { chatStore, privateChatStore } = useRootStore()
  const chat = privateChatStore.privateChats.get(props.partnerName)

  return (
    <AppDocumentTitle title={`${chatStore.identity} - ${props.partnerName}`}>
      <Container>
        <ChatRoomHeader>
          <h2>{props.partnerName}</h2>
        </ChatRoomHeader>
        <MessageList messages={chat.messages} />
        <Chatbox onSubmit={console.log} />
      </Container>
    </AppDocumentTitle>
  )
}

export default PrivateChatRoomView

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
`
