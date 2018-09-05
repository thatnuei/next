import { mdiAccountMultiple, mdiMenu } from "@mdi/js"
import { observer } from "mobx-react"
import { darken } from "polished"
import React from "react"
import MediaQuery from "react-responsive"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { ConversationMessageList } from "../conversation/ConversationMessageList"
import { ConversationUserList } from "../conversation/ConversationUserList"
import { SessionState } from "../session/SessionState"
import { ToggleState } from "../state/ToggleState"
import { flist5 } from "../ui/colors"
import { Icon } from "../ui/Icon"
import { Overlay } from "../ui/Overlay"
import { styled } from "../ui/styled"
import { ChatNavigation } from "./ChatNavigation"
import { ChatSidebar } from "./ChatSidebar"

const sidebarBreakpoint = 1000
const userListBreakpoint = 850

type Props = {
  session: SessionState
}

@observer
export class Chat extends React.Component<Props> {
  sidebarDisplay = new ToggleState(false)
  userListDisplay = new ToggleState(false)

  render() {
    const { session } = this.props
    const { activeConversation } = session.conversationStore

    const header = (
      <HeaderContainer>
        <MediaQuery maxWidth={sidebarBreakpoint}>
          <SidebarToggle onClick={this.sidebarDisplay.enable}>
            <Icon path={mdiMenu} />
          </SidebarToggle>
        </MediaQuery>

        <MediaQuery maxWidth={userListBreakpoint}>
          <SidebarToggle onClick={this.userListDisplay.enable}>
            <Icon path={mdiAccountMultiple} />
          </SidebarToggle>
        </MediaQuery>
      </HeaderContainer>
    )

    const messageList = activeConversation && (
      <ConversationMessageList messages={activeConversation.model.messages} />
    )

    const userList = activeConversation &&
      activeConversation.type === "channel" && (
        <ConversationUserList users={activeConversation.model.users} />
      )

    const navigation = (
      <ChatNavigation session={session} onTabActivate={this.sidebarDisplay.disable} />
    )

    const sidebar = <ChatSidebar session={session} navigation={navigation} />

    return (
      <ViewContainer>
        <MediaQuery minWidth={sidebarBreakpoint}>
          <div style={{ marginRight: "4px" }}>{sidebar}</div>
        </MediaQuery>

        <ChatConversationContainer>
          <ConversationLayout
            header={header}
            messageList={messageList}
            userList={<MediaQuery minWidth={userListBreakpoint}>{userList}</MediaQuery>}
          />
        </ChatConversationContainer>

        <MediaQuery maxWidth={sidebarBreakpoint}>
          <Overlay
            anchor="left"
            visible={this.sidebarDisplay.enabled}
            onShadeClick={this.sidebarDisplay.disable}
          >
            <SidebarOverlayContainer>{sidebar}</SidebarOverlayContainer>
          </Overlay>
        </MediaQuery>

        <MediaQuery maxWidth={userListBreakpoint}>
          <Overlay
            anchor="right"
            visible={this.userListDisplay.enabled}
            onShadeClick={this.userListDisplay.disable}
          >
            {userList}
          </Overlay>
        </MediaQuery>
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
  height: 2.5rem;
  align-items: center;
  justify-content: space-between;
`

const SidebarToggle = styled.button`
  padding: 0.5rem;
`

const SidebarOverlayContainer = styled.div`
  background-color: ${darken(0.05, flist5)};
  height: 100%;
`
