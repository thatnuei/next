import { action, observable } from "mobx"
import { observer } from "mobx-react"
import React from "react"
import { CharacterGender, CharacterStatus } from "../character/types"
import { ServerCommand, SocketHandler } from "../socket/SocketHandler"

type CharacterData = {
  name: string
  gender: CharacterGender
  status: CharacterStatus
  statusMessage: string
}

export type ChatProps = {
  account: string
  ticket: string
  character: string
  onDisconnect: () => void
}

@observer
export class Chat extends React.Component<ChatProps> {
  private socket = new SocketHandler()

  @observable.shallow
  private characters = new Map<string, CharacterData>()

  @action
  private handleCommand = (command: ServerCommand) => {
    switch (command.type) {
      case "LIS": {
        for (const [name, gender, status, statusMessage] of command.params.characters) {
          this.characters.set(name, { name, gender, status, statusMessage })
        }
        break
      }

      default: {
        console.log("unhandled command", command.type, command.params)
      }
    }
  }

  componentDidMount() {
    const { account, ticket, character } = this.props

    this.socket.connect({
      account,
      ticket,
      character,
      onCommand: this.handleCommand,
      onDisconnect: this.props.onDisconnect,
    })
  }

  componentWillUnmount() {
    this.socket.disconnect()
  }

  render() {
    console.log(this.characters)
    const characters = [...this.characters.values()]
    const char = characters[characters.length - 1] as CharacterData | undefined
    return <div>last character: {char ? char.name : "unknown"}</div>
  }
}
