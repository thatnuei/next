import { observer } from "mobx-react"
import React from "react"
import { Chatbox } from "../chat/Chatbox"
import { Message } from "../message/Message"
import { MessageModel } from "../message/MessageModel"
import { flist4, flist5 } from "../ui/colors"
import { styled } from "../ui/styled"
import { ConversationUserList } from "./ConversationUserList"

type Props = {
  headerContent?: React.ReactNode
  messages: MessageModel[]
  users?: string[]
}

export const ConversationLayout = observer((props: Props) => {
  return (
    <Container>
      <HeaderArea>{props.headerContent}</HeaderArea>
      <SidebarArea>{props.users && <ConversationUserList users={props.users} />}</SidebarArea>
      <MessagesArea>
        {props.messages.map((model) => (
          <Message key={model.id} model={model} />
        ))}
      </MessagesArea>
      <ChatboxArea>
        <Chatbox onSubmit={console.log} />
      </ChatboxArea>
    </Container>
  )
})

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-rows: auto 1fr auto;
  grid-row-gap: 4px;

  width: 100%;
  height: 100%;
`

const HeaderArea = styled.div`
  background-color: ${flist4};
  overflow-y: auto;
  padding: 0.5rem 0.7rem;
`

const SidebarArea = styled.div`
  background-color: ${flist4};
  grid-row: span 2;
  overflow-y: auto;
  margin-left: 4px;
`

const MessagesArea = styled.div`
  background-color: ${flist5};
  overflow-y: auto;
  transform: translateZ(0);
`

const ChatboxArea = styled.div`
  background-color: ${flist4};
  grid-column: span 2;
  padding: 4px;
`
