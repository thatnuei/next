import { observer } from "mobx-react"
import React from "react"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { ConversationMessageList } from "../conversation/ConversationMessageList"
import { PrivateChatModel } from "./PrivateChatModel"

export interface PrivateChatProps {
  model: PrivateChatModel
}

@observer
export class PrivateChat extends React.Component<PrivateChatProps> {
  render() {
    const channel = this.props.model
    return (
      <ConversationLayout
        header={<h1>{channel.partner}</h1>}
        messages={<ConversationMessageList key={channel.partner} messages={channel.messages} />}
      />
    )
  }
}
