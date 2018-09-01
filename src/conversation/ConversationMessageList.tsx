import { observer } from "mobx-react"
import React from "react"
import { Message } from "../message/Message"
import { MessageModel } from "../message/MessageModel"

export interface ConversationMessageListProps {
  messages: MessageModel[]
}

@observer
export class ConversationMessageList extends React.Component<ConversationMessageListProps> {
  render() {
    return this.props.messages.map((model) => <Message key={model.id} model={model} />)
  }
}
