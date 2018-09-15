import { mdiCodeTags, mdiCommentOutline, mdiEarth } from "@mdi/js"
import { observer } from "mobx-react"
import React from "react"
import { channelStore } from "../channel/ChannelStore"
import { conversationStore } from "../conversation/ConversationStore"
import { noop } from "../helpers/function"
import { privateChatStore } from "../privateChat/PrivateChatStore"
import { styled } from "../ui/styled"
import { ChatNavigationTab } from "./ChatNavigationTab"

type Props = {
  onTabActivate?: () => void
}

@observer
export class ChatNavigation extends React.Component<Props> {
  render() {
    const { channelConversations, privateConversations } = conversationStore
    const { onTabActivate = noop } = this.props

    const channelTabs = channelConversations.map((convo) => (
      <ChatNavigationTab
        key={convo.id}
        text={convo.title}
        icon={convo.type === "public" ? mdiEarth : mdiCommentOutline}
        active={conversationStore.isActive(convo)}
        onActivate={() => {
          conversationStore.setActiveConversation(convo)
          onTabActivate()
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
          onTabActivate()
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
