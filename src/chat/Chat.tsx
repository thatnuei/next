import { observer } from "mobx-react"
import { darken } from "polished"
import React from "react"
import MediaQuery from "react-responsive"
import { ChannelConversation } from "../channel/ChannelConversation"
import { ChannelModel } from "../channel/ChannelModel"
import { ChannelList } from "../channelList/ChannelList"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { conversationStore } from "../conversation/ConversationStore"
import { PrivateChatModel } from "../privateChat/PrivateChatModel"
import { PrivateConversation } from "../privateChat/PrivateConversation"
import { flist5 } from "../ui/colors"
import { Overlay, toggleStateProps } from "../ui/Overlay"
import { styled } from "../ui/styled"
import { chatSidebarBreakpoint } from "./breakpoints"
import { ChatSidebar } from "./ChatSidebar"
import { chatViewStore } from "./ChatViewStore"

@observer
export class Chat extends React.Component {
  get conversationElement() {
    const { activeConversation } = conversationStore

    if (activeConversation instanceof ChannelModel) {
      return <ChannelConversation channel={activeConversation} />
    }

    if (activeConversation instanceof PrivateChatModel) {
      return <PrivateConversation privateChat={activeConversation} />
    }

    return <ConversationLayout />
  }

  render() {
    return (
      <Container>
        <MediaQuery minWidth={chatSidebarBreakpoint}>
          <div style={{ marginRight: "4px" }}>
            <ChatSidebar />
          </div>
        </MediaQuery>

        <ConversationContainer>{this.conversationElement}</ConversationContainer>

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
