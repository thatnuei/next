import { observer } from "mobx-react"
import React from "react"
import { Message } from "../message/Message"
import { MessageModel } from "../message/MessageModel"
import { styled } from "../ui/styled"

export interface ConversationMessageListProps {
  messages: MessageModel[]
}

@observer
export class ConversationMessageList extends React.Component<ConversationMessageListProps> {
  render() {
    return (
      <ScrollContainer>
        {this.props.messages.map((message) => (
          <Message key={message.id} model={message} />
        ))}
      </ScrollContainer>
    )
  }
}

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`
