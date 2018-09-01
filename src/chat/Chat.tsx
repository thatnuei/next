import { observer } from "mobx-react"
import React from "react"
import { Conversation } from "../conversation/Conversation"
import { SessionState } from "../session/SessionState"
import { flist4 } from "../ui/colors"
import { styled } from "../ui/styled"
import { ChatSidebar } from "./ChatSidebar"

type Props = {
  session: SessionState
}

@observer
export class Chat extends React.Component<Props> {
  render() {
    const { session } = this.props
    const { activeConversation } = session.conversationStore

    return (
      <ViewContainer>
        <ChatSidebar session={session} />
        <ChatConversationContainer>
          {activeConversation && <Conversation data={activeConversation} />}
        </ChatConversationContainer>
      </ViewContainer>
    )
  }
}

const ViewContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
`

const ChatConversationContainer = styled.div`
  flex-grow: 1;
`

const Body = styled.div`
  flex-grow: 1;
  background-color: ${flist4};
`
