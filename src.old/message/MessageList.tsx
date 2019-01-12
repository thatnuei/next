import { observer } from "mobx-react"
import React from "react"
import { styled } from "../ui/styled"
import { Message } from "./Message"
import { MessageModel } from "./MessageModel"

export interface MessageListProps {
  messages: MessageModel[]
}

@observer
export class MessageList extends React.Component<MessageListProps> {
  private scroller = React.createRef<HTMLDivElement>()
  private scrolledToBottomThreshold = 30

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
      <ScrollContainer ref={this.scroller}>
        {this.props.messages.map((message) => (
          <Message key={message.id} model={message} />
        ))}
      </ScrollContainer>
    )
  }

  private scrollToBottom() {
    const scroller = this.scroller.current
    if (scroller) {
      scroller.scrollTop = scroller.scrollHeight
    }
  }
}

const ScrollContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: auto;
`
