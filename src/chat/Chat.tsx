import { computed } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import MediaQuery from "react-responsive"
import { AppStore } from "../app/AppStore"
import { StoreConsumer } from "../app/StoreContext"
import { ChannelHeader } from "../channel/ChannelHeader"
import { ChannelModel } from "../channel/ChannelModel"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { ConversationModel } from "../conversation/ConversationModel"
import { observerCallback } from "../helpers/mobx"
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
          <StoreConsumer>{this.renderConversation}</StoreConsumer>
        </ConversationContainer>

        <NavigationView />
      </Container>
    )
  }

  private renderConversation = observerCallback(({ conversationStore }: AppStore) => (
    <ConversationLayout
      headerContent={this.renderHeaderContent(conversationStore.activeConversation)}
      messages={conversationStore.currentMessages || []}
      users={conversationStore.currentUsers}
      chatbox={<Chatbox onSubmit={console.log} />}
    />
  ))

  @computed
  private renderHeaderContent(conversation?: ConversationModel) {
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
