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
  scroller = React.createRef<HTMLElement>()
  scrolledToBottomThreshold = 30

  scrollToBottom() {
    const scroller = this.scroller.current
    if (scroller) {
      scroller.scrollTop = scroller.scrollHeight
    }
  }

  componentDidMount() {
    this.scrollToBottom()
  }

  getSnapshotBeforeUpdate() {
    const scroller = this.scroller.current

    const isNearBottom =
      scroller != null &&
      scroller.scrollTop >=
        scroller.scrollHeight - scroller.clientHeight - this.scrolledToBottomThreshold

    return { isNearBottom }
  }

  componentDidUpdate(_: any, __: any, snapshot: { isNearBottom: boolean }) {
    if (snapshot.isNearBottom) {
      this.scrollToBottom()
    }
  }

  render() {
    return (
      <ScrollContainer innerRef={this.scroller}>
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
