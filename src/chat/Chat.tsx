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

  @observable.shallow
  private friends = new Map<string, true>()

  @observable.shallow
  private ignored = new Map<string, true>()

  @observable.shallow
  private admins = new Map<string, true>()

  @action
  private handleCommand = (command: ServerCommand) => {
    switch (command.type) {
      case "IDN": {
        console.info("Successfully connected to server.")
        break
      }

      case "CON": {
        console.info(`There are ${command.params.count} characters in chat`)
        break
      }

      case "VAR": {
        break
      }

      case "FRL": {
        for (const name of command.params.characters) {
          this.friends.set(name, true)
        }
        break
      }

      case "IGN": {
        const { params } = command

        if (params.action === "init" || params.action === "list") {
          for (const name of params.characters) {
            this.ignored.set(name, true)
          }
        }

        if (params.action === "add") {
          this.ignored.set(params.character, true)
        }

        if (params.action === "delete") {
          this.ignored.delete(params.character)
        }
        break
      }

      case "ADL": {
        for (const name of command.params.ops) {
          this.admins.set(name, true)
        }
        break
      }

      case "LIS": {
        for (const [name, gender, status, statusMessage] of command.params.characters) {
          this.characters.set(name, { name, gender, status, statusMessage })
        }
        break
      }

      case "NLN": {
        const { identity, gender } = command.params

        this.characters.set(identity, {
          name: identity,
          gender,
          status: "online",
          statusMessage: "",
        })
        break
      }

      case "FLN": {
        this.characters.delete(command.params.character)
        break
      }

      case "STA": {
        const { character: name, status, statusmsg } = command.params
        const { gender = "None" }: Partial<CharacterData> = this.characters.get(name) || {}
        this.characters.set(name, { name, gender, status, statusMessage: statusmsg })
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
    const characters = [...this.characters.values()]
    const char = characters[characters.length - 1] as CharacterData | undefined
    return <div>last character: {char ? char.name : "unknown"}</div>
  }
}
