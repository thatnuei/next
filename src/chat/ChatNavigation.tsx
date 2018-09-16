import { mdiCodeTags, mdiCommentOutline, mdiEarth } from "@mdi/js"
import { observer } from "mobx-react"
import React from "react"
import { appStore } from "../app/AppStore"
import { noop } from "../helpers/function"
import { styled } from "../ui/styled"
import { ChatNavigationTab } from "./ChatNavigationTab"

type Props = {
  onTabActivate?: () => void
}

@observer
export class ChatNavigation extends React.Component<Props> {
  render() {
    const { channelConversations, privateConversations } = appStore.conversationStore
    const { onTabActivate = noop } = this.props

    const channelTabs = channelConversations.map((convo) => (
      <ChatNavigationTab
        key={convo.id}
        text={convo.title}
        icon={convo.type === "public" ? mdiEarth : mdiCommentOutline}
        active={appStore.conversationStore.isActive(convo)}
        onActivate={() => {
          appStore.conversationStore.setActiveConversation(convo)
          onTabActivate()
        }}
        onClose={() => appStore.channelStore.leaveChannel(convo.id)}
      />
    ))

    const privateChatTabs = privateConversations.map((convo) => (
      <ChatNavigationTab
        key={convo.id}
        text={convo.partner}
        avatar={convo.partner}
        active={appStore.conversationStore.isActive(convo)}
        onActivate={() => {
          appStore.conversationStore.setActiveConversation(convo)
          onTabActivate()
        }}
        onClose={() => appStore.privateChatStore.closeChat(convo.partner)}
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
