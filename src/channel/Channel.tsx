import { observer } from "mobx-react"
import React from "react"
import { ConversationLayout } from "../conversation/ConversationLayout"
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
        headerContent={<h1>{model.title}</h1>}
        messages={model.messages}
        users={[...model.users.keys()]}
      />
    )
  }
}
