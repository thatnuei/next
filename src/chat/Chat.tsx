import { computed } from "mobx"
import { observer } from "mobx-react"
import { darken } from "polished"
import React from "react"
import MediaQuery from "react-responsive"
import { ChannelHeader } from "../channel/ChannelHeader"
import { ChannelModel } from "../channel/ChannelModel"
import { ChannelList } from "../channelList/ChannelList"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { conversationStore } from "../conversation/ConversationStore"
import { PrivateChatHeader } from "../privateChat/PrivateChatHeader"
import { PrivateChatModel } from "../privateChat/PrivateChatModel"
import { flist5 } from "../ui/colors"
import { Overlay, toggleStateProps } from "../ui/Overlay"
import { styled } from "../ui/styled"
import { chatSidebarBreakpoint } from "./breakpoints"
import { Chatbox } from "./Chatbox"
import { ChatSidebar } from "./ChatSidebar"
import { chatViewStore } from "./ChatViewStore"

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

        <Overlay anchor="left" {...toggleStateProps(chatViewStore.sidebarDisplay)}>
          <SidebarOverlayContainer>
            <ChatSidebar />
          </SidebarOverlayContainer>
        </Overlay>

        <Overlay {...toggleStateProps(chatViewStore.channelListDisplay)}>
          <ChannelList />
        </Overlay>
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

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
`

const IconButton = styled.button`
  padding: 0.5rem;
`

const SidebarOverlayContainer = styled.div`
  background-color: ${darken(0.05, flist5)};
  height: 100%;
`
