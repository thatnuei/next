import { mdiCodeTags, mdiEarth } from "@mdi/js"
import { observer } from "mobx-react"
import React from "react"
import { SessionState } from "../session/SessionState"
import { styled } from "../ui/styled"
import { ChatNavigationTab } from "./ChatNavigationTab"

export interface ChatNavigationProps {
  session: SessionState
}

@observer
export class ChatNavigation extends React.Component<ChatNavigationProps> {
  render() {
    const { conversationStore } = this.props.session
    const { channelConversations } = conversationStore

    const channelTabs = channelConversations.map((convo) => (
      <ChatNavigationTab
        key={convo.id}
        text={convo.model.title}
        icon={mdiEarth}
        active={conversationStore.isActive(convo)}
        onActivate={() => conversationStore.setActiveConversation(convo)}
      />
    ))

    return (
      <div>
        <ChatNavigationTab text="Console" icon={mdiCodeTags} />

        <SectionHeader>PMs</SectionHeader>
        <ChatNavigationTab
          text="Subaru-chan"
          avatar="Subaru-chan"
          onActivate={() => console.log("activate")}
          onClose={() => console.log("close")}
        />
        <ChatNavigationTab text="Athena Light" avatar="Athena Light" />
        <ChatNavigationTab text="Akiyama Ai" avatar="Akiyama Ai" />
        <ChatNavigationTab text="Alli Moon" avatar="Alli Moon" />

        <SectionHeader>Channels</SectionHeader>
        {channelTabs}
      </div>
    )
  }
}

const SectionHeader = styled.h2`
  font-size: 1.2rem;
  margin: 0.8rem 0.7rem 0.4rem;
  opacity: 0.5;
`
