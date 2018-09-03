import { observer } from "mobx-react"
import React from "react"
import { Chatbox } from "../chat/Chatbox"
import { flist4, flist5 } from "../ui/colors"
import { styled } from "../ui/styled"

type Props = {
  header?: React.ReactNode
  messages?: React.ReactNode
  users?: React.ReactNode
}

export const ConversationLayout = observer((props: Props) => {
  return (
    <Container>
      <HeaderArea>{props.header}</HeaderArea>
      <UserListArea>{props.users}</UserListArea>
      <MessagesArea>{props.messages}</MessagesArea>
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
`

const UserListArea = styled.div`
  grid-row: span 2;

  /* make spacing dependent on the presence of the child element */
  > :first-child {
    margin-left: 4px;
  }
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
