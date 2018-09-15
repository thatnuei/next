import { computed } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import MediaQuery from "react-responsive"
import { ChannelHeader } from "../channel/ChannelHeader"
import { ChannelModel } from "../channel/ChannelModel"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { conversationStore } from "../conversation/ConversationStore"
import { NavigationScreen } from "../navigation/NavigationStore"
import { PrivateChatHeader } from "../privateChat/PrivateChatHeader"
import { PrivateChatModel } from "../privateChat/PrivateChatModel"
import { styled } from "../ui/styled"
import { chatSidebarBreakpoint } from "./breakpoints"
import { Chatbox } from "./Chatbox"
import { ChatSidebar } from "./ChatSidebar"

@observer
export class Chat extends React.Component {
  render() {
    const { activeConversation } = conversationStore

    const messages = activeConversation
      ? activeConversation.displayedMessages || activeConversation.messages
      : []

    const users = activeConversation && activeConversation.users

    return (
      <Container>
        <MediaQuery minWidth={chatSidebarBreakpoint}>
          <div style={{ marginRight: "4px" }}>
            <ChatSidebar />
          </div>
        </MediaQuery>

        <ConversationContainer>
          <ConversationLayout
            headerContent={this.headerContent}
            messages={messages}
            users={users}
            chatbox={<Chatbox onSubmit={console.log} />}
          />
        </ConversationContainer>
      </Container>
    )
  }

  @computed
  private get headerContent() {
    const { activeConversation } = conversationStore

    if (activeConversation instanceof ChannelModel) {
      return <ChannelHeader channel={activeConversation} />
    }

    if (activeConversation instanceof PrivateChatModel) {
      return <PrivateChatHeader privateChat={activeConversation} />
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
