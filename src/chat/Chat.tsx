import { observer } from "mobx-react"
import React from "react"
import { SocketHandler } from "../socket/SocketHandler"
import { CharacterData, ChatViewModel } from "./ChatViewModel"

export type ChatProps = {
  account: string
  ticket: string
  character: string
  onDisconnect: () => void
}

@observer
export class Chat extends React.Component<ChatProps> {
  private socket = new SocketHandler()
  private viewModel = new ChatViewModel()

  componentDidMount() {
    const { account, ticket, character } = this.props

    this.socket.connect({
      account,
      ticket,
      character,
      onCommand: this.viewModel.handleSocketCommand,
      onDisconnect: this.props.onDisconnect,
    })
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  render() {
    const characters = [...this.viewModel.characters.values()]
    const char = characters[characters.length - 1] as CharacterData | undefined
    return <div>last character: {char ? char.name : "unknown"}</div>
  }
}
