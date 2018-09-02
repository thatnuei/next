import React from "react"
import { Channel } from "../channel/Channel"
import { PrivateChat } from "../privateChat/PrivateChat"
import { ConversationType } from "./ConversationStore"

export interface ConversationProps {
  data: ConversationType
}

export class Conversation extends React.Component<ConversationProps> {
  render() {
    const { data } = this.props
    switch (data.type) {
      case "channel":
        return <Channel model={data.model} />
      case "privateChat":
        return <PrivateChat model={data.model} />
    }
  }
}
