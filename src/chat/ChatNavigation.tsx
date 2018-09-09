import { mdiCodeTags, mdiCommentOutline, mdiEarth } from "@mdi/js"
import { observer } from "mobx-react"
import React from "react"
import { channelStore } from "../channel/ChannelStore"
import { conversationStore } from "../conversation/ConversationStore"
import { privateChatStore } from "../privateChat/PrivateChatStore"
import { styled } from "../ui/styled"
import { ChatNavigationTab } from "./ChatNavigationTab"
import { chatViewStore } from "./ChatViewStore"

@observer
export class ChatNavigation extends React.Component {
  render() {
    const { channelConversations, privateConversations } = conversationStore

    const channelTabs = channelConversations.map((convo) => (
      <ChatNavigationTab
        key={convo.id}
        text={convo.title}
        icon={convo.type === "public" ? mdiEarth : mdiCommentOutline}
        active={conversationStore.isActive(convo)}
        onActivate={() => {
          conversationStore.setActiveConversation(convo)
          chatViewStore.sidebarDisplay.disable()
        }}
        onClose={() => channelStore.leaveChannel(convo.id)}
      />
    ))

    const privateChatTabs = privateConversations.map((convo) => (
      <ChatNavigationTab
        key={convo.id}
        text={convo.partner}
        avatar={convo.partner}
        active={conversationStore.isActive(convo)}
        onActivate={() => {
          conversationStore.setActiveConversation(convo)
          chatViewStore.sidebarDisplay.disable()
        }}
        onClose={() => privateChatStore.closeChat(convo.partner)}
      />
    ))

    return (
      <>
        <ChatNavigationTab text="Console" icon={mdiCodeTags} />

        <SectionHeader>PMs</SectionHeader>
        {privateChatTabs}

        <SectionHeader>Channels</SectionHeader>
        {channelTabs}
      </>
    )
  }
}

const SectionHeader = styled.h2`
  font-size: 1.2rem;
  margin: 8px;
  opacity: 0.5;
`
