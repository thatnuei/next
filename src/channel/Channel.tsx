import { observer } from "mobx-react"
import React from "react"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { ConversationMessageList } from "../conversation/ConversationMessageList"
import { ConversationUserList } from "../conversation/ConversationUserList"
import { ChannelModel } from "./ChannelModel"

export interface ChannelProps {
  model: ChannelModel
}

@observer
export class Channel extends React.Component<ChannelProps> {
  render() {
    const { model } = this.props
    return (
      <ConversationLayout
        header={<h1>{model.title}</h1>}
        messages={<ConversationMessageList key={model.id} messages={model.messages} />}
        users={<ConversationUserList key={model.id} users={model.users} />}
      />
    )
  }
}
