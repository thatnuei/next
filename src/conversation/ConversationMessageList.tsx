import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { Message } from "../message/Message"
import { MessageModel } from "../message/MessageModel"
import { styled } from "../ui/styled"

function animationFrame() {
  return new Promise(requestAnimationFrame)
}

export interface ConversationMessageListProps {
  messages: MessageModel[]
}

@observer
export class ConversationMessageList extends React.Component<ConversationMessageListProps> {
  container = React.createRef<HTMLElement>()

  @observable
  renderCount = 20

  @action
  incrementRenderCount() {
    this.renderCount += 20
  }

  scrollToBottom() {
    const scroller = this.container.current
    if (scroller) {
      scroller.scrollTop = scroller.scrollHeight
    }
  }

  async componentDidMount() {
    while (this.renderCount < this.props.messages.length) {
      await animationFrame()
      this.incrementRenderCount()
      this.scrollToBottom()
    }
  }

  render() {
    return (
      <ScrollContainer innerRef={this.container}>
        {this.props.messages.slice(-this.renderCount).map((message) => (
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
