import { observer } from "mobx-react"
import React from "react"
import { SessionState } from "../session/SessionState"
import { flist4 } from "../ui/colors"
import { styled } from "../ui/styled"
import { ChatConversationLayout } from "./ChatConversationLayout"
import { ChatSidebar } from "./ChatSidebar"

type Props = {
  session: SessionState
}

@observer
export class Chat extends React.Component<Props> {
  render() {
    return (
      <ViewContainer>
        <ChatSidebar session={this.props.session} />
        <ChatConversationContainer>
          <ChatConversationLayout />
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
