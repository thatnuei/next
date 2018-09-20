import { observer } from "mobx-react"
import React from "react"
import MediaQuery from "react-responsive"
import { userListBreakpoint } from "../channel/breakpoints"
import { ChatSidebarToggle } from "../chat/ChatSidebarToggle"
import { MessageModel } from "../message/MessageModel"
import { flist4 } from "../ui/colors"
import { styled } from "../ui/styled"
import { ConversationMessageList } from "./ConversationMessageList"

type Props = {
  headerContent?: React.ReactNode
  messages?: MessageModel[]
  users?: JSX.Element
  chatbox?: React.ReactNode
}

export const ConversationLayout = observer((props: Props) => {
  return (
    <Container>
      <HeaderArea>
        <ChatSidebarToggle />
        <HeaderContentContainer>{props.headerContent}</HeaderContentContainer>
      </HeaderArea>

      <UserListArea>
        <MediaQuery minWidth={userListBreakpoint}>{props.users}</MediaQuery>
      </UserListArea>

      <MessagesArea>
        {props.messages && <ConversationMessageList messages={props.messages} />}
      </MessagesArea>

      <ChatboxArea>{props.chatbox}</ChatboxArea>
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
  display: flex;
  background-color: ${flist4};
  overflow-y: auto;
`

const HeaderContentContainer = styled.div`
  flex-grow: 1;
`

const UserListArea = styled.div`
  grid-row: span 2;

  /* make spacing dependent on the presence of the child element */
  > :first-child {
    margin-left: 4px;
  }
`

const MessagesArea = styled.div`
  overflow-y: auto;
  transform: translateZ(0);
`

const ChatboxArea = styled.div`
  background-color: ${flist4};
  grid-column: span 2;
  padding: 4px;
`
