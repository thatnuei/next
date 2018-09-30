import { observer } from "mobx-react"
import React from "react"
import MediaQuery from "react-responsive"
import { ChannelHeader } from "../channel/ChannelHeader"
import { ChannelModel } from "../channel/ChannelModel"
import { ChannelUserList } from "../channel/ChannelUserList"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { NavigationScreen } from "../navigation/NavigationStore"
import { NavigationView } from "../navigation/NavigationView"
import { PrivateChatHeader } from "../privateChat/PrivateChatHeader"
import { PrivateChatModel } from "../privateChat/PrivateChatModel"
import { appStore } from "../store"
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

        <ConversationContainer>{this.renderConversation()}</ConversationContainer>

        <NavigationView />
      </Container>
    )
  }

  private renderConversation() {
    const conversation = appStore.conversationStore.activeConversation

    if (conversation instanceof ChannelModel) {
      const handleChatboxSubmit = (message: string) => {
        appStore.channelStore.sendMessage(conversation.id, message)
      }

      return (
        <ConversationLayout
          headerContent={<ChannelHeader channel={conversation} />}
          messages={conversation.displayedMessages}
          users={<ChannelUserList users={conversation.users} ops={conversation.ops} />}
          chatbox={<Chatbox onSubmit={handleChatboxSubmit} />}
        />
      )
    }

    if (conversation instanceof PrivateChatModel) {
      const handleChatboxSubmit = (message: string) => {
        appStore.privateChatStore.sendMessage(conversation.partner, message)
      }

      return (
        <ConversationLayout
          headerContent={<PrivateChatHeader privateChat={conversation} />}
          messages={conversation.messages}
          chatbox={<Chatbox onSubmit={handleChatboxSubmit} />}
        />
      )
    }

    return <ConversationLayout headerContent={<h2 style={{ padding: "0.5rem 0.7rem" }}>next</h2>} />
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
