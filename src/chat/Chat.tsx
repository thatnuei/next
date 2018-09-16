import { observer } from "mobx-react"
import React from "react"
import MediaQuery from "react-responsive"
import { appStore } from "../app/AppStore"
import { ChannelHeader } from "../channel/ChannelHeader"
import { ChannelModel } from "../channel/ChannelModel"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { NavigationScreen } from "../navigation/NavigationStore"
import { NavigationView } from "../navigation/NavigationView"
import { PrivateChatHeader } from "../privateChat/PrivateChatHeader"
import { PrivateChatModel } from "../privateChat/PrivateChatModel"
import { styled } from "../ui/styled"
import { chatSidebarBreakpoint } from "./breakpoints"
import { Chatbox } from "./Chatbox"
import { ChatSidebar } from "./ChatSidebar"

@observer
export class Chat extends React.Component {
  render() {
    return (
      <Container>
        <MediaQuery minWidth={chatSidebarBreakpoint}>
          <div style={{ marginRight: "4px" }}>
            <ChatSidebar />
          </div>
        </MediaQuery>

        <ConversationContainer>
          <ConversationLayout
            headerContent={this.renderHeaderContent()}
            messages={appStore.conversationStore.currentMessages || []}
            users={appStore.conversationStore.currentUsers}
            chatbox={<Chatbox onSubmit={console.log} />}
          />
        </ConversationContainer>

        <NavigationView />
      </Container>
    )
  }

  private renderHeaderContent() {
    const conversation = appStore.conversationStore.activeConversation

    if (conversation instanceof ChannelModel) {
      return <ChannelHeader channel={conversation} />
    }

    if (conversation instanceof PrivateChatModel) {
      return <PrivateChatHeader privateChat={conversation} />
    }

    return <h2 style={{ padding: "0.5rem 0.7rem" }}>next</h2>
  }
}

const Container = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;

  display: flex;
`

const ConversationContainer = styled.div`
  flex-grow: 1;
`

export const chatScreen = (): NavigationScreen => ({
  key: "chat",
  render: () => <Chat />,
})
