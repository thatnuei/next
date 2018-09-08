import { observer } from "mobx-react"
import React from "react"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { PrivateChatModel } from "./PrivateChatModel"

export interface PrivateConversationProps {
  privateChat: PrivateChatModel
}

@observer
export class PrivateConversation extends React.Component<PrivateConversationProps> {
  render() {
    const { privateChat } = this.props

    const headerContent = (
      <div style={{ padding: "0.5rem" }}>
        <h2>{privateChat.partner}</h2>
      </div>
    )

    return <ConversationLayout headerContent={headerContent} messages={privateChat.messages} />
  }
}
