import { observer } from "mobx-react-lite"
import React from "react"
import Chatbox from "../chat/Chatbox"
import ChatRoomHeader from "../chat/ChatRoomHeader"
import MessageList from "../message/MessageList"
import { scrollVertical } from "../ui/helpers"
import { styled } from "../ui/styled"
import ChannelHeader from "./ChannelHeader"
import ChannelModel from "./ChannelModel"

type Props = {
  channel: ChannelModel
}

function ChannelRoomView({ channel }: Props) {
  return (
    <Container>
      <ChatRoomHeader>
        <ChannelHeader channel={channel} />
      </ChatRoomHeader>

      <MessageListContainer>
        <MessageList messages={channel.filteredMessages} />
      </MessageListContainer>

      <Chatbox onSubmit={console.log} />
    </Container>
  )
}
export default observer(ChannelRoomView)

const Container = styled.div`
  display: grid;
  grid-template-rows: auto 1fr auto;
  height: 100%;
`
const MessageListContainer = styled.div`
  ${scrollVertical};
`
