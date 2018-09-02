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
    const channel = this.props.model
    return (
      <ConversationLayout
        header={<h1>{channel.title}</h1>}
        messages={<ConversationMessageList key={channel.id} messages={channel.messages} />}
        users={<ConversationUserList key={channel.id} users={channel.users} />}
      />
    )
  }
}
