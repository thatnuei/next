import { observer } from "mobx-react"
import React from "react"
import { ConversationLayout } from "../conversation/ConversationLayout"
import { ChannelHeader } from "./ChannelHeader"
import { ChannelModel } from "./ChannelModel"

export interface ChannelConversationProps {
  channel: ChannelModel
}

@observer
export class ChannelConversation extends React.Component<ChannelConversationProps> {
  render() {
    const { channel } = this.props
    return (
      <ConversationLayout
        headerContent={<ChannelHeader channel={this.props.channel} />}
        messages={channel.filteredMessages}
        users={channel.users}
      />
    )
  }
}
