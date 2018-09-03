import { mdiMenu } from "@mdi/js"
import { observer } from "mobx-react"
import { darken } from "polished"
import React from "react"
import Responsive from "react-responsive"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { ConversationMessageList } from "../conversation/ConversationMessageList"
import { ConversationUserList } from "../conversation/ConversationUserList"
import { SessionState } from "../session/SessionState"
import { ToggleState } from "../state/ToggleState"
import { flist5 } from "../ui/colors"
import { Icon } from "../ui/Icon"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"
import { sidebarBreakpoint } from "./breakpoints"
import { ChatSidebar } from "./ChatSidebar"

type Props = {
  session: SessionState
}

@observer
export class Chat extends React.Component<Props> {
  sidebarDisplay = new ToggleState(false)

  render() {
    const { session } = this.props
    const { activeConversation } = session.conversationStore

    const header = (
      <HeaderContainer>
        <Responsive maxWidth={sidebarBreakpoint}>
          <SidebarToggle onClick={this.sidebarDisplay.enable}>
            <Icon path={mdiMenu} />
          </SidebarToggle>
        </Responsive>
      </HeaderContainer>
    )

    const messageList = activeConversation && (
      <ConversationMessageList messages={activeConversation.model.messages} />
    )

    const userList = activeConversation &&
      "users" in activeConversation.model && (
        <ConversationUserList users={activeConversation.model.users} />
      )

    return (
      <ViewContainer>
        <Responsive minWidth={sidebarBreakpoint}>
          <div style={{ marginRight: "4px" }}>
            <ChatSidebar session={session} />
          </div>
        </Responsive>

        <ChatConversationContainer>
          <ConversationLayout header={header} messages={messageList} users={userList} />
        </ChatConversationContainer>

        <Responsive maxWidth={sidebarBreakpoint}>
          <Overlay
            anchor="left"
            visible={this.sidebarDisplay.enabled}
            onShadeClick={this.sidebarDisplay.disable}
          >
            <SidebarOverlayContainer>
              <ChatSidebar session={session} />
            </SidebarOverlayContainer>
          </Overlay>
        </Responsive>
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

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  height: 2.5rem;
`

const SidebarToggle = styled.button`
  padding: 0.5rem;
`

const SidebarOverlayContainer = styled.div`
  background-color: ${darken(0.05, flist5)};
  height: 100%;
`
