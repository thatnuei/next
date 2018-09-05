import { mdiCodeTags, mdiEarth } from "@mdi/js"
import { observer } from "mobx-react"
import React from "react"
import { SessionState } from "../session/SessionState"
import { styled } from "../ui/styled"
import { ChatNavigationTab } from "./ChatNavigationTab"

export interface ChatNavigationProps {
  session: SessionState
  onTabActivate: () => void
}

@observer
export class ChatNavigation extends React.Component<ChatNavigationProps> {
  render() {
    const { conversationStore, channels, privateChatStore } = this.props.session
    const { channelConversations, privateConversations } = conversationStore

    const channelTabs = channelConversations.map((convo) => (
      <ChatNavigationTab
        key={convo.id}
        text={convo.model.title}
        icon={mdiEarth}
        active={conversationStore.isActive(convo)}
        onActivate={() => {
          conversationStore.setActiveConversation(convo)
          this.props.onTabActivate()
        }}
        onClose={() => channels.leaveChannel(convo.model.id)}
      />
    ))

    const privateChatTabs = privateConversations.map((convo) => (
      <ChatNavigationTab
        key={convo.id}
        text={convo.model.partner}
        avatar={convo.model.partner}
        active={conversationStore.isActive(convo)}
        onActivate={() => {
          conversationStore.setActiveConversation(convo)
          this.props.onTabActivate()
        }}
        onClose={() => privateChatStore.closeChat(convo.model.partner)}
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
  margin: 0.8rem 0.7rem 0.4rem;
  opacity: 0.5;
`
